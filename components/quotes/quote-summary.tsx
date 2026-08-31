import { formatCurrency } from "@/lib/money";

export function QuoteSummary({
  subtotal,
  discountAmount,
  taxTotal,
  total,
}: {
  subtotal: string;
  discountAmount: string;
  taxTotal: string;
  total: string;
}) {
  const hasDiscount = discountAmount !== "0.00";

  return (
    <dl className="ml-auto w-full max-w-sm space-y-3 px-5 py-5 text-sm tabular-nums">
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="font-medium">
          {formatCurrency(subtotal, { minimumFractionDigits: 2 })}
        </dd>
      </div>
      {hasDiscount && (
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Discount</dt>
          <dd className="font-medium text-emerald-700">
            -{formatCurrency(discountAmount, { minimumFractionDigits: 2 })}
          </dd>
        </div>
      )}
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">Tax</dt>
        <dd className="font-medium">
          {formatCurrency(taxTotal, { minimumFractionDigits: 2 })}
        </dd>
      </div>
      <div className="flex items-center justify-between border-t pt-3 text-base">
        <dt className="font-semibold">Total</dt>
        <dd className="pl-4 text-right text-xl font-semibold tracking-tight">
          {formatCurrency(total, { minimumFractionDigits: 2 })}
        </dd>
      </div>
    </dl>
  );
}
