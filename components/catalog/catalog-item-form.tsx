"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

import {
  createCatalogItem,
  updateCatalogItem,
  type CatalogItemActionState,
} from "@/app/(app)/catalog/actions";
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
import {
  catalogUnits,
  type CatalogItemInput,
} from "@/lib/validation/catalog-item";

const INITIAL_STATE: CatalogItemActionState = { status: "idle" };
const selectStyles =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:opacity-50";

type CatalogItemFormValues = CatalogItemInput & { id?: string };

function unitLabel(unit: string) {
  return unit.charAt(0).toUpperCase() + unit.slice(1);
}

function FieldError({
  id,
  errors,
}: {
  id: string;
  errors?: string[];
}) {
  if (!errors?.length) {
    return null;
  }

  return (
    <p id={id} className="text-xs text-destructive">
      {errors[0]}
    </p>
  );
}

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="h-9" disabled={pending}>
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Save className="size-4" aria-hidden="true" />
      )}
      {pending
        ? mode === "create"
          ? "Creating..."
          : "Saving..."
        : mode === "create"
          ? "Create item"
          : "Save changes"}
    </Button>
  );
}

export function CatalogItemForm({
  mode,
  item,
}: {
  mode: "create" | "edit";
  item?: CatalogItemFormValues;
}) {
  const router = useRouter();
  const action =
    mode === "edit" && item?.id
      ? updateCatalogItem.bind(null, item.id)
      : createCatalogItem;
  const [state, formAction] = useActionState(action, INITIAL_STATE);

  useEffect(() => {
    if (state.status === "success") {
      router.replace("/catalog");
      router.refresh();
    }
  }, [router, state.status]);

  const errorFor = (field: keyof CatalogItemInput) =>
    state.fieldErrors?.[field];
  const fieldProps = (field: keyof CatalogItemInput) => ({
    "aria-invalid": Boolean(errorFor(field)),
    "aria-describedby": errorFor(field) ? `catalog-${field}-error` : undefined,
  });

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
        >
          {state.message}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Item details</CardTitle>
          <CardDescription>
            Add a reusable product or service for future quotes.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="catalog-name" className="text-sm font-medium">
              Item name
            </label>
            <Input
              id="catalog-name"
              name="name"
              defaultValue={item?.name ?? ""}
              required
              {...fieldProps("name")}
            />
            <FieldError id="catalog-name-error" errors={errorFor("name")} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="catalog-sku" className="text-sm font-medium">
              SKU <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="catalog-sku"
              name="sku"
              defaultValue={item?.sku ?? ""}
              {...fieldProps("sku")}
            />
            <FieldError id="catalog-sku-error" errors={errorFor("sku")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label
              htmlFor="catalog-description"
              className="text-sm font-medium"
            >
              Description
            </label>
            <Textarea
              id="catalog-description"
              name="description"
              defaultValue={item?.description ?? ""}
              rows={4}
              required
              {...fieldProps("description")}
            />
            <FieldError
              id="catalog-description-error"
              errors={errorFor("description")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
          <CardDescription>
            Prices and tax rates are stored exactly to two decimal places.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label htmlFor="catalog-unit" className="text-sm font-medium">
              Unit
            </label>
            <select
              id="catalog-unit"
              name="unit"
              defaultValue={item?.unit ?? "each"}
              className={selectStyles}
              {...fieldProps("unit")}
            >
              {catalogUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unitLabel(unit)}
                </option>
              ))}
            </select>
            <FieldError id="catalog-unit-error" errors={errorFor("unit")} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="catalog-price" className="text-sm font-medium">
              Unit price (ZAR)
            </label>
            <Input
              id="catalog-price"
              name="unitPrice"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              defaultValue={item?.unitPrice ?? "0.00"}
              required
              {...fieldProps("unitPrice")}
            />
            <FieldError
              id="catalog-unitPrice-error"
              errors={errorFor("unitPrice")}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="catalog-tax" className="text-sm font-medium">
              Tax rate (%)
            </label>
            <Input
              id="catalog-tax"
              name="taxRate"
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              step="0.01"
              defaultValue={item?.taxRate ?? "15.00"}
              required
              {...fieldProps("taxRate")}
            />
            <FieldError
              id="catalog-taxRate-error"
              errors={errorFor("taxRate")}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-end gap-2">
        <Link
          href="/catalog"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-9",
          )}
        >
          Cancel
        </Link>
        <SubmitButton mode={mode} />
      </div>
    </form>
  );
}
