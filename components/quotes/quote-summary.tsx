import { formatCurrency } from "@/lib/money";
import { quoteLineItems } from "@/lib/mock-data";

export function QuoteSummary() {
  const subtotal = quoteLineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  return (
    <dl className="ml-auto w-full max-w-sm space-y-3 px-5 py-5 text-sm">
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="font-medium">{formatCurrency(subtotal)}</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">VAT (15%)</dt>
        <dd className="font-medium">{formatCurrency(tax)}</dd>
      </div>
      <div className="flex items-center justify-between border-t pt-3 text-base">
        <dt className="font-semibold">Total</dt>
        <dd className="text-xl font-semibold tracking-tight">
          {formatCurrency(total)}
        </dd>
      </div>
    </dl>
  );
}
