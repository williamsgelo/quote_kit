"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

import {
  createCustomer,
  updateCustomer,
  type CustomerActionState,
} from "@/app/(app)/customers/actions";
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
import type { CustomerInput } from "@/lib/validation/customer";

const INITIAL_STATE: CustomerActionState = { status: "idle" };

type CustomerFormValues = CustomerInput & { id?: string };

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
          ? "Create customer"
          : "Save changes"}
    </Button>
  );
}

export function CustomerForm({
  mode,
  customer,
}: {
  mode: "create" | "edit";
  customer?: CustomerFormValues;
}) {
  const router = useRouter();
  const action =
    mode === "edit" && customer?.id
      ? updateCustomer.bind(null, customer.id)
      : createCustomer;
  const [state, formAction] = useActionState(action, INITIAL_STATE);

  useEffect(() => {
    if (state.status === "success" && state.customerId) {
      router.replace(`/customers/${state.customerId}`);
      router.refresh();
    }
  }, [router, state.customerId, state.status]);

  const errorFor = (field: keyof CustomerInput) => state.fieldErrors?.[field];
  const fieldProps = (field: keyof CustomerInput) => ({
    "aria-invalid": Boolean(errorFor(field)),
    "aria-describedby": errorFor(field)
      ? `customer-${field}-error`
      : undefined,
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
          <CardTitle>Customer details</CardTitle>
          <CardDescription>
            Primary contact and business information for this customer.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="customer-name" className="text-sm font-medium">
              Customer name
            </label>
            <Input
              id="customer-name"
              name="name"
              defaultValue={customer?.name ?? ""}
              autoComplete="name"
              required
              {...fieldProps("name")}
            />
            <FieldError id="customer-name-error" errors={errorFor("name")} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="customer-company" className="text-sm font-medium">
              Company name
            </label>
            <Input
              id="customer-company"
              name="companyName"
              defaultValue={customer?.companyName ?? ""}
              autoComplete="organization"
              {...fieldProps("companyName")}
            />
            <FieldError
              id="customer-companyName-error"
              errors={errorFor("companyName")}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="customer-email" className="text-sm font-medium">
              Email address
            </label>
            <Input
              id="customer-email"
              name="email"
              type="email"
              defaultValue={customer?.email ?? ""}
              autoComplete="email"
              {...fieldProps("email")}
            />
            <FieldError id="customer-email-error" errors={errorFor("email")} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="customer-phone" className="text-sm font-medium">
              Phone number
            </label>
            <Input
              id="customer-phone"
              name="phone"
              type="tel"
              defaultValue={customer?.phone ?? ""}
              autoComplete="tel"
              {...fieldProps("phone")}
            />
            <FieldError id="customer-phone-error" errors={errorFor("phone")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="customer-tax" className="text-sm font-medium">
              Tax number
            </label>
            <Input
              id="customer-tax"
              name="taxNumber"
              defaultValue={customer?.taxNumber ?? ""}
              {...fieldProps("taxNumber")}
            />
            <FieldError
              id="customer-taxNumber-error"
              errors={errorFor("taxNumber")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <CardDescription>
            Optional billing and document address details.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="address-line-1" className="text-sm font-medium">
              Address line 1
            </label>
            <Input
              id="address-line-1"
              name="addressLine1"
              defaultValue={customer?.addressLine1 ?? ""}
              autoComplete="address-line1"
              {...fieldProps("addressLine1")}
            />
            <FieldError
              id="customer-addressLine1-error"
              errors={errorFor("addressLine1")}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="address-line-2" className="text-sm font-medium">
              Address line 2
            </label>
            <Input
              id="address-line-2"
              name="addressLine2"
              defaultValue={customer?.addressLine2 ?? ""}
              autoComplete="address-line2"
              {...fieldProps("addressLine2")}
            />
            <FieldError
              id="customer-addressLine2-error"
              errors={errorFor("addressLine2")}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="customer-city" className="text-sm font-medium">
              City
            </label>
            <Input
              id="customer-city"
              name="city"
              defaultValue={customer?.city ?? ""}
              autoComplete="address-level2"
              {...fieldProps("city")}
            />
            <FieldError id="customer-city-error" errors={errorFor("city")} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="customer-province" className="text-sm font-medium">
              Province / state
            </label>
            <Input
              id="customer-province"
              name="province"
              defaultValue={customer?.province ?? ""}
              autoComplete="address-level1"
              {...fieldProps("province")}
            />
            <FieldError
              id="customer-province-error"
              errors={errorFor("province")}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="customer-postal" className="text-sm font-medium">
              Postal code
            </label>
            <Input
              id="customer-postal"
              name="postalCode"
              defaultValue={customer?.postalCode ?? ""}
              autoComplete="postal-code"
              {...fieldProps("postalCode")}
            />
            <FieldError
              id="customer-postalCode-error"
              errors={errorFor("postalCode")}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="customer-country" className="text-sm font-medium">
              Country
            </label>
            <Input
              id="customer-country"
              name="country"
              defaultValue={customer?.country ?? ""}
              autoComplete="country-name"
              {...fieldProps("country")}
            />
            <FieldError
              id="customer-country-error"
              errors={errorFor("country")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Internal notes</CardTitle>
          <CardDescription>
            Notes are visible only inside your organisation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <label htmlFor="customer-notes" className="sr-only">
            Internal notes
          </label>
          <Textarea
            id="customer-notes"
            name="notes"
            defaultValue={customer?.notes ?? ""}
            rows={5}
            {...fieldProps("notes")}
          />
          <FieldError id="customer-notes-error" errors={errorFor("notes")} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-end gap-2">
        <Link
          href={customer?.id ? `/customers/${customer.id}` : "/customers"}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-9")}
        >
          Cancel
        </Link>
        <SubmitButton mode={mode} />
      </div>
    </form>
  );
}
