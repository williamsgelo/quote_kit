import type { ReactNode } from "react";

import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

function EditableText({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      aria-label={label}
      className={cn(
        "inline-block min-w-16 rounded bg-blue-50 px-1.5 py-0.5 outline-none ring-blue-200 hover:ring-1 focus:ring-2 print:bg-transparent print:px-0 print:py-0 print:ring-0",
        className,
      )}
    >
      {children}
    </span>
  );
}

const lineItems = [
  {
    description: "Service or product description",
    quantity: "1",
    unitPrice: "R 0.00",
    amount: "R 0.00",
  },
  {
    description: "Additional service or product",
    quantity: "1",
    unitPrice: "R 0.00",
    amount: "R 0.00",
  },
  {
    description: "Optional third line item",
    quantity: "1",
    unitPrice: "R 0.00",
    amount: "R 0.00",
  },
];

export function EditableQuotationTemplate() {
  return (
    <article
      id="quotation-template"
      aria-labelledby="quotation-template-title"
      className="quotation-template mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-300 bg-white text-slate-950 shadow-xl shadow-slate-900/8"
    >
      <div className="border-b border-slate-200 bg-slate-950 px-5 py-5 text-white sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-blue-300 uppercase">
              Quotation
            </p>
            <h2
              id="quotation-template-title"
              className="mt-2 text-2xl font-semibold tracking-tight"
            >
              <EditableText
                label="Business name"
                className="min-w-52 bg-white/10 text-white ring-white/30 print:text-slate-950"
              >
                Your Business Name
              </EditableText>
            </h2>
            <div className="mt-3 space-y-1 text-sm text-slate-300 print:text-slate-700">
              <p>
                <EditableText
                  label="Business contact information"
                  className="min-w-64 bg-white/10 ring-white/30"
                >
                  email@example.co.za · 012 345 6789
                </EditableText>
              </p>
              <p>
                <EditableText
                  label="Optional business registration and VAT information"
                  className="min-w-64 bg-white/10 ring-white/30"
                >
                  Company / registration / VAT details (optional)
                </EditableText>
              </p>
            </div>
          </div>

          <dl className="grid min-w-64 grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-slate-400 print:text-slate-600">
              Quotation number
            </dt>
            <dd className="text-right font-medium">
              <EditableText label="Quotation number">QUOTE-001</EditableText>
            </dd>
            <dt className="text-slate-400 print:text-slate-600">Issue date</dt>
            <dd className="text-right font-medium">
              <EditableText label="Issue date">DD MMM YYYY</EditableText>
            </dd>
            <dt className="text-slate-400 print:text-slate-600">Expiry date</dt>
            <dd className="text-right font-medium">
              <EditableText label="Expiry date">DD MMM YYYY</EditableText>
            </dd>
          </dl>
        </div>
      </div>

      <div className="space-y-8 p-5 sm:p-8">
        <section className="quotation-template-section" aria-labelledby="customer-heading">
          <p
            id="customer-heading"
            className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase"
          >
            Prepared for
          </p>
          <div className="mt-3 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 text-sm">
              <p className="font-semibold">
                <EditableText label="Customer or company name" className="min-w-56">
                  Customer or Company Name
                </EditableText>
              </p>
              <p className="text-slate-600">
                <EditableText label="Customer email or contact" className="min-w-56">
                  customer@example.co.za · 012 345 6789
                </EditableText>
              </p>
            </div>
            <address className="text-sm leading-6 text-slate-600 not-italic">
              <EditableText label="Customer address" className="min-h-12 min-w-64">
                Customer address, suburb, city, province, postal code
              </EditableText>
            </address>
          </div>
        </section>

        <section className="quotation-template-section" aria-label="Quotation line items">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-160 border-collapse text-left text-sm">
              <thead className="bg-slate-100 text-xs tracking-wide text-slate-600 uppercase">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Description
                  </th>
                  <th scope="col" className="w-24 px-4 py-3 text-right font-semibold">
                    Quantity
                  </th>
                  <th scope="col" className="w-32 px-4 py-3 text-right font-semibold">
                    Unit price
                  </th>
                  <th scope="col" className="w-32 px-4 py-3 text-right font-semibold">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {lineItems.map((item, index) => (
                  <tr key={item.description}>
                    <td className="px-4 py-4 align-top">
                      <EditableText
                        label={`Line item ${index + 1} description`}
                        className="w-full min-w-60"
                      >
                        {item.description}
                      </EditableText>
                    </td>
                    <td className="px-4 py-4 text-right align-top tabular-nums">
                      <EditableText label={`Line item ${index + 1} quantity`}>
                        {item.quantity}
                      </EditableText>
                    </td>
                    <td className="px-4 py-4 text-right align-top tabular-nums">
                      <EditableText label={`Line item ${index + 1} unit price`}>
                        {item.unitPrice}
                      </EditableText>
                    </td>
                    <td className="px-4 py-4 text-right align-top font-medium tabular-nums">
                      <EditableText label={`Line item ${index + 1} amount`}>
                        {item.amount}
                      </EditableText>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="quotation-template-section ml-auto max-w-sm" aria-label="Quotation totals">
          <dl className="space-y-3 text-sm tabular-nums">
            <div className="flex items-center justify-between gap-8">
              <dt className="text-slate-600">Subtotal</dt>
              <dd className="font-medium">
                <EditableText label="Subtotal">R 0.00</EditableText>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-8">
              <dt className="text-slate-600">Discount</dt>
              <dd className="font-medium text-emerald-700">
                <EditableText label="Discount amount">- R 0.00</EditableText>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-8">
              <dt className="text-slate-600">Tax / VAT</dt>
              <dd className="font-medium">
                <EditableText label="Tax or VAT amount">R 0.00</EditableText>
              </dd>
            </div>
            <div className="flex items-end justify-between gap-8 border-t border-slate-300 pt-3">
              <dt className="font-semibold">Total</dt>
              <dd className="text-xl font-semibold tracking-tight">
                <EditableText label="Total amount">R 0.00</EditableText>
              </dd>
            </div>
          </dl>
        </section>

        <div className="quotation-template-section grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-2">
          <section aria-labelledby="notes-heading">
            <h3 id="notes-heading" className="text-sm font-semibold">
              Notes
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              <EditableText label="Quotation notes" className="min-h-16 w-full">
                Add a short customer message, scope clarification, or delivery note.
              </EditableText>
            </p>
          </section>
          <section aria-labelledby="terms-heading">
            <h3 id="terms-heading" className="text-sm font-semibold">
              Terms
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              <EditableText label="Quotation terms" className="min-h-16 w-full">
                Add payment terms, lead times, exclusions, and conditions that apply.
              </EditableText>
            </p>
          </section>
        </div>

        <section
          className="quotation-template-section rounded-xl border border-slate-200 bg-slate-50 p-5"
          aria-labelledby="acceptance-heading"
        >
          <h3 id="acceptance-heading" className="text-sm font-semibold">
            Acceptance
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            <EditableText label="Acceptance instructions" className="w-full">
              To accept this quotation, sign below or confirm acceptance in writing.
            </EditableText>
          </p>
          <div className="mt-7 grid gap-6 text-sm sm:grid-cols-3">
            {[
              ["Name", "Customer name"],
              ["Signature", "Signature"],
              ["Date", "DD MMM YYYY"],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="min-h-8 border-b border-slate-400">
                  <EditableText label={label} className="w-full bg-white">
                    {value}
                  </EditableText>
                </div>
                <p className="mt-1 text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="quotation-template-section flex items-center justify-between gap-4 border-t border-slate-200 pt-5 text-xs text-slate-500">
          <p>This quotation is subject to the terms shown above.</p>
          <Logo compact className="shrink-0 text-slate-700" />
        </div>
      </div>
    </article>
  );
}
