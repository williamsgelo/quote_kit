import { formatCurrency, quoteLineItems } from "@/lib/mock-data";

export function QuoteLineItems() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-155 text-left text-sm">
        <caption className="sr-only">Quote line items</caption>
        <thead className="border-y bg-muted/35 text-xs text-muted-foreground">
          <tr>
            <th className="h-11 px-5 font-medium">Item</th>
            <th className="h-11 px-4 text-right font-medium">Quantity</th>
            <th className="h-11 px-4 text-right font-medium">Unit price</th>
            <th className="h-11 px-5 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {quoteLineItems.map((item) => (
            <tr key={item.id} className="border-b last:border-0">
              <td className="px-5 py-4">
                <p className="font-medium">{item.name}</p>
                <p className="mt-1 max-w-lg text-xs leading-5 text-muted-foreground">
                  {item.description}
                </p>
              </td>
              <td className="px-4 py-4 text-right">{item.quantity}</td>
              <td className="px-4 py-4 text-right">
                {formatCurrency(item.unitPrice)}
              </td>
              <td className="px-5 py-4 text-right font-medium">
                {formatCurrency(item.quantity * item.unitPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
