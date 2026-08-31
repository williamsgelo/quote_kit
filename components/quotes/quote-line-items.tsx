import { formatCurrency, formatDecimalPercentage } from "@/lib/money";

export type QuoteLineItemView = {
  id: string;
  name: string;
  description: string;
  unit: string;
  quantity: string;
  unitPrice: string;
  taxRate: string;
  total: string;
};

function formatQuantity(value: string) {
  const [whole, fraction = ""] = value.split(".");
  const trimmedFraction = fraction.replace(/0+$/, "");
  return trimmedFraction ? `${whole}.${trimmedFraction}` : whole;
}

export function QuoteLineItems({ items }: { items: QuoteLineItemView[] }) {
  return (
    <>
      <ul className="divide-y sm:hidden" aria-label="Quote line items">
        {items.map((item) => (
          <li key={item.id} className="space-y-4 px-5 py-5">
            <div>
              <p className="break-words font-medium">{item.name}</p>
              {item.description && (
                <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Quantity</dt>
                <dd className="mt-1">
                  {formatQuantity(item.quantity)} {item.unit}
                </dd>
              </div>
              <div className="text-right">
                <dt className="text-xs text-muted-foreground">Unit price</dt>
                <dd className="mt-1 tabular-nums">
                  {formatCurrency(item.unitPrice, {
                    minimumFractionDigits: 2,
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Tax</dt>
                <dd className="mt-1">
                  {formatDecimalPercentage(item.taxRate)}
                </dd>
              </div>
              <div className="text-right">
                <dt className="text-xs text-muted-foreground">Line total</dt>
                <dd className="mt-1 font-semibold tabular-nums">
                  {formatCurrency(item.total, { minimumFractionDigits: 2 })}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto sm:block">
      <table className="w-full min-w-180 text-left text-sm">
        <caption className="sr-only">Quote line items</caption>
        <thead className="border-y bg-muted/35 text-xs text-muted-foreground">
          <tr>
            <th className="h-11 px-5 font-medium">Item</th>
            <th className="h-11 px-4 text-right font-medium">Quantity</th>
            <th className="h-11 px-4 text-right font-medium">Unit price</th>
            <th className="h-11 px-4 text-right font-medium">Tax</th>
            <th className="h-11 px-5 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b last:border-0">
              <td className="px-5 py-4">
                <p className="break-words font-medium">{item.name}</p>
                {item.description && (
                  <p className="mt-1 max-w-lg whitespace-pre-wrap break-words text-xs leading-5 text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </td>
              <td className="px-4 py-4 text-right">
                {formatQuantity(item.quantity)} {item.unit}
              </td>
              <td className="px-4 py-4 text-right">
                {formatCurrency(item.unitPrice, { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-4 text-right">
                {formatDecimalPercentage(item.taxRate)}
              </td>
              <td className="px-5 py-4 text-right font-medium">
                {formatCurrency(item.total, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
