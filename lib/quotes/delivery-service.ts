import "server-only";

import { Prisma, QuoteActivityType, QuoteStatus } from "@/generated/prisma/client";
import { EmailDeliveryError, sendResendEmail, type QuoteEmailSender } from "@/lib/email/resend";
import { trustedAppOrigin } from "@/lib/email/config";
import { formatCurrency } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { runSerializableTransaction } from "@/lib/prisma-transaction";
import { formatQuoteNumber } from "@/lib/quotes/numbering";
import {
  generateQuotePublicToken,
  isValidQuotePublicToken,
} from "@/lib/quotes/public-token";
import {
  isQuoteExpired,
  QuoteTransitionError,
  transitionQuoteStatus,
} from "@/lib/quotes/transitions";

const PUBLIC_TOKEN_ATTEMPTS = 3;
const PUBLIC_QUOTE_STATUSES: readonly QuoteStatus[] = [
  QuoteStatus.SENT,
  QuoteStatus.VIEWED,
  QuoteStatus.ACCEPTED,
  QuoteStatus.DECLINED,
];

export class QuoteSendError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuoteSendError";
  }
}

export class PublicQuoteExpiredError extends Error {
  constructor() {
    super("This quote has expired and can no longer be accepted.");
    this.name = "PublicQuoteExpiredError";
  }
}

export function buildPublicQuoteUrl(token: string, appUrl?: string) {
  if (!isValidQuotePublicToken(token)) {
    throw new QuoteSendError("The public Quote token is invalid.");
  }
  return new URL(`/q/${token}`, trustedAppOrigin(appUrl)).toString();
}

function isPublicTokenCollision(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function ensureQuotePublicTokenForOrganization(
  organizationId: string,
  quoteId: string,
) {
  for (let attempt = 1; attempt <= PUBLIC_TOKEN_ATTEMPTS; attempt += 1) {
    const token = generateQuotePublicToken();

    try {
      return await runSerializableTransaction(async (transaction) => {
        const quote = await transaction.quote.findFirst({
          where: { id: quoteId, organizationId },
          select: { id: true, publicToken: true, status: true },
        });

        if (!quote) {
          throw new QuoteSendError("The quote is unavailable.");
        }
        if (quote.publicToken) {
          return quote.publicToken;
        }
        if (quote.status !== QuoteStatus.DRAFT) {
          throw new QuoteSendError(
            "A public link cannot be generated for this quote state.",
          );
        }

        const updated = await transaction.quote.update({
          where: { id: quote.id },
          data: { publicToken: token },
          select: { publicToken: true },
        });

        return updated.publicToken as string;
      });
    } catch (error) {
      if (!isPublicTokenCollision(error) || attempt === PUBLIC_TOKEN_ATTEMPTS) {
        throw error;
      }
    }
  }

  throw new QuoteSendError("A secure public Quote link could not be generated.");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function quoteEmailContent(quote: {
  organization: { name: string };
  customerName: string;
  quoteNumber: number;
  total: Prisma.Decimal;
  expiryDate: Date;
  publicUrl: string;
}) {
  const number = formatQuoteNumber(quote.quoteNumber);
  const total = formatCurrency(quote.total.toFixed(2), {
    minimumFractionDigits: 2,
  });
  const expiryDate = new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(quote.expiryDate);

  const business = escapeHtml(quote.organization.name);
  const customer = escapeHtml(quote.customerName);
  const safeNumber = escapeHtml(number);
  const safeTotal = escapeHtml(total);
  const safeExpiry = escapeHtml(expiryDate);
  const safeUrl = escapeHtml(quote.publicUrl);

  return {
    subject: `Quote ${number} from ${quote.organization.name}`,
    text: [
      `Hello ${quote.customerName},`,
      "",
      `${quote.organization.name} has sent you a quote.`,
      `Quote number: ${number}`,
      `Total: ${total}`,
      `Valid until: ${expiryDate}`,
      "",
      `View quote: ${quote.publicUrl}`,
    ].join("\n"),
    html: `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;line-height:1.6"><div style="max-width:600px;margin:0 auto;padding:24px 16px"><div style="border:1px solid #e2e8f0;border-radius:12px;background:#ffffff;padding:28px"><p style="margin:0;color:#475569;font-size:14px;font-weight:600">${business}</p><h1 style="margin:8px 0 20px;font-size:24px;line-height:1.25">Quote ${safeNumber}</h1><p>Hello ${customer},</p><p>${business} has sent you a quote.</p><table role="presentation" style="width:100%;margin:20px 0;border-collapse:collapse"><tr><td style="padding:10px 0;color:#64748b;font-size:14px">Total</td><td style="padding:10px 0;text-align:right;font-weight:700">${safeTotal}</td></tr><tr><td style="border-top:1px solid #e2e8f0;padding:10px 0;color:#64748b;font-size:14px">Valid until</td><td style="border-top:1px solid #e2e8f0;padding:10px 0;text-align:right">${safeExpiry}</td></tr></table><p style="margin:28px 0"><a href="${safeUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">View quote</a></p><p style="margin-bottom:0;font-size:12px;color:#64748b;word-break:break-all">If the button does not work, open ${safeUrl}</p></div></div></body></html>`,
  };
}

type SendQuoteOptions = {
  emailSender?: QuoteEmailSender;
  appUrl?: string;
  now?: Date;
};

export async function sendQuoteForOrganization(
  organizationId: string,
  quoteId: string,
  options: SendQuoteOptions = {},
) {
  const quote = await prisma.quote.findFirst({
    where: { id: quoteId, organizationId },
    select: {
      id: true,
      status: true,
      customerEmail: true,
      customerName: true,
      quoteNumber: true,
      total: true,
      expiryDate: true,
      organization: { select: { name: true } },
      _count: { select: { items: true } },
    },
  });

  if (!quote) {
    throw new QuoteSendError("The quote is unavailable.");
  }
  transitionQuoteStatus(quote.status, "SEND");
  if (!quote.customerEmail?.trim()) {
    throw new QuoteSendError("Add a customer email address before sending.");
  }
  if (quote._count.items < 1) {
    throw new QuoteSendError("A quote must contain at least one item.");
  }

  const publicToken = await ensureQuotePublicTokenForOrganization(
    organizationId,
    quoteId,
  );
  const publicUrl = buildPublicQuoteUrl(publicToken, options.appUrl);
  const content = quoteEmailContent({ ...quote, publicUrl });
  const emailSender = options.emailSender ?? sendResendEmail;

  try {
    await emailSender({
      to: quote.customerEmail,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });
  } catch (error) {
    if (error instanceof EmailDeliveryError) {
      throw error;
    }
    throw new EmailDeliveryError();
  }

  const sentAt = options.now ?? new Date();
  const sent = await runSerializableTransaction(async (transaction) => {
    const current = await transaction.quote.findFirst({
      where: { id: quoteId, organizationId },
      select: { id: true, status: true },
    });
    if (!current) {
      throw new QuoteSendError("The quote is unavailable.");
    }

    const transition = transitionQuoteStatus(current.status, "SEND");
    return transaction.quote.update({
      where: { id: current.id },
      data: {
        status: transition.status,
        sentAt,
        activities: { create: { type: QuoteActivityType.SENT } },
      },
      select: { id: true, status: true, sentAt: true },
    });
  });

  return { ...sent, publicToken, publicUrl };
}

const publicQuoteSelect = {
  publicToken: true,
  quoteNumber: true,
  status: true,
  issueDate: true,
  expiryDate: true,
  currency: true,
  subtotal: true,
  discountAmount: true,
  taxTotal: true,
  total: true,
  customerName: true,
  customerCompanyName: true,
  customerEmail: true,
  customerPhone: true,
  customerTaxNumber: true,
  customerAddressLine1: true,
  customerAddressLine2: true,
  customerCity: true,
  customerProvince: true,
  customerPostalCode: true,
  customerCountry: true,
  customerMessage: true,
  terms: true,
  sentAt: true,
  firstViewedAt: true,
  acceptedAt: true,
  declinedAt: true,
  organization: { select: { name: true } },
  items: {
    orderBy: [{ position: "asc" }, { id: "asc" }],
    select: {
      name: true,
      description: true,
      unit: true,
      quantity: true,
      unitPrice: true,
      taxRate: true,
      total: true,
    },
  },
} satisfies Prisma.QuoteSelect;

export async function getPublicQuoteAndMarkViewed(
  token: string,
  now = new Date(),
) {
  if (!isValidQuotePublicToken(token)) {
    return null;
  }

  return runSerializableTransaction(async (transaction) => {
    const quote = await transaction.quote.findUnique({
      where: { publicToken: token },
      select: { id: true, status: true, firstViewedAt: true },
    });
    if (
      !quote ||
      !PUBLIC_QUOTE_STATUSES.includes(quote.status)
    ) {
      return null;
    }

    const transition = transitionQuoteStatus(quote.status, "VIEW");
    if (!quote.firstViewedAt) {
      await transaction.quote.update({
        where: { id: quote.id },
        data: {
          status: transition.status,
          firstViewedAt: now,
          activities: { create: { type: QuoteActivityType.VIEWED } },
        },
      });
    }

    return transaction.quote.findUnique({
      where: { id: quote.id },
      select: publicQuoteSelect,
    });
  });
}

export async function respondToPublicQuote(
  token: string,
  response: "ACCEPT" | "DECLINE",
  now = new Date(),
) {
  if (!isValidQuotePublicToken(token)) {
    return null;
  }

  return runSerializableTransaction(async (transaction) => {
    const quote = await transaction.quote.findUnique({
      where: { publicToken: token },
      select: { id: true, status: true, expiryDate: true },
    });
    if (!quote || quote.status === QuoteStatus.DRAFT) {
      return null;
    }
    if (response === "ACCEPT" && isQuoteExpired(quote.expiryDate, now)) {
      throw new PublicQuoteExpiredError();
    }

    const transition = transitionQuoteStatus(quote.status, response);
    if (!transition.changed) {
      return { status: transition.status, changed: false };
    }

    const activityType =
      response === "ACCEPT"
        ? QuoteActivityType.ACCEPTED
        : QuoteActivityType.DECLINED;
    const updated = await transaction.quote.update({
      where: { id: quote.id },
      data: {
        status: transition.status,
        ...(response === "ACCEPT"
          ? { acceptedAt: now }
          : { declinedAt: now }),
        activities: { create: { type: activityType } },
      },
      select: { status: true },
    });

    return { status: updated.status, changed: true };
  });
}

export { QuoteTransitionError };
