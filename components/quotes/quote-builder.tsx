"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  createDraftQuoteAction,
  updateDraftQuoteAction,
  type QuoteActionState,
} from "@/app/(app)/quotes/actions";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { catalogUnits } from "@/lib/validation/catalog-item";

const INITIAL_STATE: QuoteActionState = { status: "idle" };
const selectStyles =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:opacity-50";

export type QuoteCustomerOption = {
  id: string;
  name: string;
  companyName: string | null;
  isArchived: boolean;
};

export type QuoteCatalogOption = {
  id: string;
  name: string;
  description: string;
  sku: string | null;
  unit: string;
  unitPrice: string;
  taxRate: string;
};

export type QuoteBuilderInitialData = {
  id?: string;
  customerId: string;
  issueDate: string;
  expiryDate: string;
  currency: string;
  discountType: "NONE" | "PERCENTAGE" | "FIXED";
  discountValue: string;
  customerMessage: string;
  notes: string;
  terms: string;
  items: Array<{
    id?: string;
    catalogItemId: string | null;
    name: string;
    description: string;
    unit: string;
    quantity: string;
    unitPrice: string;
    taxRate: string;
  }>;
};

type BuilderLine = QuoteBuilderInitialData["items"][number] & { key: string };

function unitLabel(unit: string) {
  return unit.charAt(0).toUpperCase() + unit.slice(1);
}

function emptyLine(key: string): BuilderLine {
  return {
    key,
    catalogItemId: null,
    name: "",
    description: "",
    unit: "each",
    quantity: "1.0000",
    unitPrice: "0.00",
    taxRate: "15.00",
  };
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }
  return <p className="text-xs text-destructive">{errors[0]}</p>;
}

export function QuoteBuilder({
  mode,
  customers,
  catalogItems,
  initialData,
}: {
  mode: "create" | "edit";
  customers: QuoteCustomerOption[];
  catalogItems: QuoteCatalogOption[];
  initialData: QuoteBuilderInitialData;
}) {
  const router = useRouter();
  const nextLineKey = useRef(initialData.items.length + 1);
  const action =
    mode === "edit" && initialData.id
      ? updateDraftQuoteAction.bind(null, initialData.id)
      : createDraftQuoteAction;
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);
  const [customerId, setCustomerId] = useState(initialData.customerId);
  const [issueDate, setIssueDate] = useState(initialData.issueDate);
  const [expiryDate, setExpiryDate] = useState(initialData.expiryDate);
  const [currency, setCurrency] = useState(initialData.currency);
  const [discountType, setDiscountType] = useState(
    initialData.discountType,
  );
  const [discountValue, setDiscountValue] = useState(initialData.discountValue);
  const [customerMessage, setCustomerMessage] = useState(
    initialData.customerMessage,
  );
  const [notes, setNotes] = useState(initialData.notes);
  const [terms, setTerms] = useState(initialData.terms);
  const [selectedCatalogId, setSelectedCatalogId] = useState("");
  const [lines, setLines] = useState<BuilderLine[]>(() =>
    initialData.items.length
      ? initialData.items.map((item, index) => ({
          ...item,
          key: item.id ?? `initial-${index + 1}`,
        }))
      : [emptyLine("initial-1")],
  );

  useEffect(() => {
    if (state.status === "success" && state.quoteId) {
      router.replace(`/quotes/${state.quoteId}`);
      router.refresh();
    }
  }, [router, state.quoteId, state.status]);

  const fieldError = (path: string) => state.fieldErrors?.[path];
  const updateLine = (
    lineKey: string,
    field: keyof Omit<BuilderLine, "key">,
    value: string,
  ) => {
    setLines((current) =>
      current.map((line) =>
        line.key === lineKey ? { ...line, [field]: value } : line,
      ),
    );
  };
  const newKey = () => `line-${nextLineKey.current++}`;
  const addCustomLine = () => {
    setLines((current) => [...current, emptyLine(newKey())]);
  };
  const addCatalogLine = () => {
    const catalogItem = catalogItems.find(
      (item) => item.id === selectedCatalogId,
    );
    if (!catalogItem) {
      return;
    }
    setLines((current) => [
      ...current,
      {
        key: newKey(),
        catalogItemId: catalogItem.id,
        name: catalogItem.name,
        description: catalogItem.description,
        unit: catalogItem.unit,
        quantity: "1.0000",
        unitPrice: catalogItem.unitPrice,
        taxRate: catalogItem.taxRate,
      },
    ]);
    setSelectedCatalogId("");
  };
  const payload = JSON.stringify({
    customerId,
    issueDate,
    expiryDate,
    currency,
    discountType,
    discountValue: discountType === "NONE" ? "0.00" : discountValue,
    customerMessage,
    notes,
    terms,
    items: lines.map((line) => ({
      catalogItemId: line.catalogItemId,
      name: line.name,
      description: line.description,
      unit: line.unit,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      taxRate: line.taxRate,
    })),
  });

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <input type="hidden" name="quotePayload" value={payload} />

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
        >
          {state.message}
        </p>
      )}

      <fieldset disabled={pending} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quote details</CardTitle>
            <CardDescription>
              Choose the customer and validity period for this draft.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="quote-customer" className="text-sm font-medium">
                Customer
              </label>
              <select
                id="quote-customer"
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                className={selectStyles}
                aria-invalid={Boolean(fieldError("customerId"))}
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                    {customer.companyName ? ` — ${customer.companyName}` : ""}
                    {customer.isArchived ? " (archived)" : ""}
                  </option>
                ))}
              </select>
              <FieldError errors={fieldError("customerId")} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="quote-issue-date" className="text-sm font-medium">
                Issue date
              </label>
              <Input
                id="quote-issue-date"
                type="date"
                value={issueDate}
                onChange={(event) => setIssueDate(event.target.value)}
                aria-invalid={Boolean(fieldError("issueDate"))}
              />
              <FieldError errors={fieldError("issueDate")} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="quote-expiry-date" className="text-sm font-medium">
                Expiry date
              </label>
              <Input
                id="quote-expiry-date"
                type="date"
                value={expiryDate}
                onChange={(event) => setExpiryDate(event.target.value)}
                aria-invalid={Boolean(fieldError("expiryDate"))}
              />
              <FieldError errors={fieldError("expiryDate")} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="quote-currency" className="text-sm font-medium">
                Currency
              </label>
              <select
                id="quote-currency"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                className={selectStyles}
              >
                <option value="ZAR">ZAR — South African rand</option>
              </select>
              <FieldError errors={fieldError("currency")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Line items</CardTitle>
            <CardDescription>
              Add an active Catalog item or create a one-off custom line.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-col gap-2 rounded-lg border bg-muted/20 p-3 sm:flex-row">
              <select
                value={selectedCatalogId}
                onChange={(event) => setSelectedCatalogId(event.target.value)}
                className={cn(selectStyles, "sm:flex-1")}
                aria-label="Catalog item"
              >
                <option value="">Select a Catalog item</option>
                {catalogItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                    {item.sku ? ` (${item.sku})` : ""}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-9"
                onClick={addCatalogLine}
                disabled={!selectedCatalogId}
              >
                <BookOpen className="size-4" aria-hidden="true" />
                Add from Catalog
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-9"
                onClick={addCustomLine}
              >
                <Plus className="size-4" aria-hidden="true" />
                Add custom item
              </Button>
            </div>

            {catalogItems.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No active Catalog items are available. Custom lines can still be
                added.
              </p>
            )}
            <FieldError errors={fieldError("items")} />

            <div className="space-y-4">
              {lines.map((line, index) => (
                <div key={line.key} className="rounded-xl border p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">Item {index + 1}</p>
                      <Badge variant="outline">
                        {line.catalogItemId ? "Catalog snapshot" : "Custom"}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove item ${index + 1}`}
                      onClick={() =>
                        setLines((current) =>
                          current.filter((item) => item.key !== line.key),
                        )
                      }
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-12">
                    <div className="space-y-1.5 lg:col-span-5">
                      <label
                        htmlFor={`line-${line.key}-name`}
                        className="text-sm font-medium"
                      >
                        Name
                      </label>
                      <Input
                        id={`line-${line.key}-name`}
                        value={line.name}
                        onChange={(event) =>
                          updateLine(line.key, "name", event.target.value)
                        }
                        aria-invalid={Boolean(
                          fieldError(`items.${index}.name`),
                        )}
                      />
                      <FieldError errors={fieldError(`items.${index}.name`)} />
                    </div>
                    <div className="space-y-1.5 lg:col-span-2">
                      <label
                        htmlFor={`line-${line.key}-unit`}
                        className="text-sm font-medium"
                      >
                        Unit
                      </label>
                      <select
                        id={`line-${line.key}-unit`}
                        value={line.unit}
                        onChange={(event) =>
                          updateLine(line.key, "unit", event.target.value)
                        }
                        className={selectStyles}
                      >
                        {catalogUnits.map((unit) => (
                          <option key={unit} value={unit}>
                            {unitLabel(unit)}
                          </option>
                        ))}
                      </select>
                      <FieldError errors={fieldError(`items.${index}.unit`)} />
                    </div>
                    <div className="space-y-1.5 lg:col-span-2">
                      <label
                        htmlFor={`line-${line.key}-quantity`}
                        className="text-sm font-medium"
                      >
                        Quantity
                      </label>
                      <Input
                        id={`line-${line.key}-quantity`}
                        type="number"
                        inputMode="decimal"
                        min="0.0001"
                        step="0.0001"
                        value={line.quantity}
                        onChange={(event) =>
                          updateLine(line.key, "quantity", event.target.value)
                        }
                        aria-invalid={Boolean(
                          fieldError(`items.${index}.quantity`),
                        )}
                      />
                      <FieldError
                        errors={fieldError(`items.${index}.quantity`)}
                      />
                    </div>
                    <div className="space-y-1.5 lg:col-span-2">
                      <label
                        htmlFor={`line-${line.key}-price`}
                        className="text-sm font-medium"
                      >
                        Unit price
                      </label>
                      <Input
                        id={`line-${line.key}-price`}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        value={line.unitPrice}
                        onChange={(event) =>
                          updateLine(line.key, "unitPrice", event.target.value)
                        }
                        aria-invalid={Boolean(
                          fieldError(`items.${index}.unitPrice`),
                        )}
                      />
                      <FieldError
                        errors={fieldError(`items.${index}.unitPrice`)}
                      />
                    </div>
                    <div className="space-y-1.5 lg:col-span-1">
                      <label
                        htmlFor={`line-${line.key}-tax`}
                        className="text-sm font-medium"
                      >
                        Tax %
                      </label>
                      <Input
                        id={`line-${line.key}-tax`}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        max="100"
                        step="0.01"
                        value={line.taxRate}
                        onChange={(event) =>
                          updateLine(line.key, "taxRate", event.target.value)
                        }
                        aria-invalid={Boolean(
                          fieldError(`items.${index}.taxRate`),
                        )}
                      />
                      <FieldError
                        errors={fieldError(`items.${index}.taxRate`)}
                      />
                    </div>
                    <div className="space-y-1.5 lg:col-span-12">
                      <label
                        htmlFor={`line-${line.key}-description`}
                        className="text-sm font-medium"
                      >
                        Description
                      </label>
                      <Textarea
                        id={`line-${line.key}-description`}
                        value={line.description}
                        onChange={(event) =>
                          updateLine(line.key, "description", event.target.value)
                        }
                        rows={2}
                        className="min-h-18"
                        aria-invalid={Boolean(
                          fieldError(`items.${index}.description`),
                        )}
                      />
                      <FieldError
                        errors={fieldError(`items.${index}.description`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Card>
            <CardHeader>
              <CardTitle>Customer communication</CardTitle>
              <CardDescription>
                Optional content stored with this quote.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="quote-message" className="text-sm font-medium">
                  Customer message
                </label>
                <Textarea
                  id="quote-message"
                  value={customerMessage}
                  onChange={(event) => setCustomerMessage(event.target.value)}
                  rows={3}
                />
                <FieldError errors={fieldError("customerMessage")} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="quote-notes" className="text-sm font-medium">
                  Internal notes
                </label>
                <Textarea
                  id="quote-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                />
                <FieldError errors={fieldError("notes")} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="quote-terms" className="text-sm font-medium">
                  Terms
                </label>
                <Textarea
                  id="quote-terms"
                  value={terms}
                  onChange={(event) => setTerms(event.target.value)}
                  rows={4}
                />
                <FieldError errors={fieldError("terms")} />
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Discount and totals</CardTitle>
              <CardDescription>
                Final totals are always recalculated on the server when saved.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="discount-type" className="text-sm font-medium">
                  Discount type
                </label>
                <select
                  id="discount-type"
                  value={discountType}
                  onChange={(event) => {
                    const value = event.target.value as
                      | "NONE"
                      | "PERCENTAGE"
                      | "FIXED";
                    setDiscountType(value);
                    if (value === "NONE") {
                      setDiscountValue("0.00");
                    }
                  }}
                  className={selectStyles}
                >
                  <option value="NONE">No discount</option>
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed amount</option>
                </select>
                <FieldError errors={fieldError("discountType")} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="discount-value" className="text-sm font-medium">
                  {discountType === "PERCENTAGE"
                    ? "Discount percentage"
                    : "Discount value"}
                </label>
                <Input
                  id="discount-value"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max={discountType === "PERCENTAGE" ? "100" : undefined}
                  step="0.01"
                  value={discountValue}
                  onChange={(event) => setDiscountValue(event.target.value)}
                  disabled={discountType === "NONE"}
                  aria-invalid={Boolean(fieldError("discountValue"))}
                />
                <FieldError errors={fieldError("discountValue")} />
              </div>
              <p className="rounded-lg bg-muted/50 p-3 text-xs leading-5 text-muted-foreground">
                Client values are treated as draft inputs only. Subtotal,
                discount allocation, tax, and final total are produced by the
                canonical Decimal pricing engine during the transaction.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Link
            href={initialData.id ? `/quotes/${initialData.id}` : "/quotes"}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-9",
            )}
          >
            Cancel
          </Link>
          <Button type="submit" size="lg" className="h-9" disabled={pending}>
            {pending ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="size-4" aria-hidden="true" />
            )}
            {pending
              ? mode === "create"
                ? "Saving draft..."
                : "Updating draft..."
              : mode === "create"
                ? "Save draft"
                : "Save changes"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
