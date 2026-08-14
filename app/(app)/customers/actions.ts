"use server";

import { revalidatePath } from "next/cache";

import { requireOrganization } from "@/lib/auth/access";
import {
  archiveCustomerForOrganization,
  createCustomerForOrganization,
  updateCustomerForOrganization,
} from "@/lib/customers/service";
import { customerSchema, type CustomerInput } from "@/lib/validation/customer";

export type CustomerActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  customerId?: string;
  fieldErrors?: Partial<Record<keyof CustomerInput, string[]>>;
};

function customerPayload(formData: FormData) {
  return {
    name: formData.get("name"),
    companyName: formData.get("companyName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    taxNumber: formData.get("taxNumber"),
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2"),
    city: formData.get("city"),
    province: formData.get("province"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country"),
    notes: formData.get("notes"),
  };
}

function validationError(
  error: ReturnType<typeof customerSchema.safeParse> & { success: false },
): CustomerActionState {
  return {
    status: "error",
    message: "Check the highlighted fields and try again.",
    fieldErrors: error.error.flatten().fieldErrors,
  };
}

function reportCustomerError(operation: string, error: unknown) {
  console.error(
    `[customers] ${operation} failed: ${
      error instanceof Error ? error.name : "UnknownError"
    }`,
  );
}

export async function createCustomer(
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const { organization } = await requireOrganization({ behavior: "throw" });
  const parsedCustomer = customerSchema.safeParse(customerPayload(formData));

  if (!parsedCustomer.success) {
    return validationError(parsedCustomer);
  }

  try {
    const customer = await createCustomerForOrganization(
      organization.id,
      parsedCustomer.data,
    );

    revalidatePath("/customers");

    return {
      status: "success",
      message: "Customer created.",
      customerId: customer.id,
    };
  } catch (error) {
    reportCustomerError("create", error);

    return {
      status: "error",
      message: "We could not create the customer. Please try again.",
    };
  }
}

export async function updateCustomer(
  customerId: string,
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const { organization } = await requireOrganization({ behavior: "throw" });
  const parsedCustomer = customerSchema.safeParse(customerPayload(formData));

  if (!parsedCustomer.success) {
    return validationError(parsedCustomer);
  }

  try {
    const customer = await updateCustomerForOrganization(
      organization.id,
      customerId,
      parsedCustomer.data,
    );

    if (!customer) {
      return {
        status: "error",
        message: "The customer could not be updated.",
      };
    }

    revalidatePath("/customers");
    revalidatePath(`/customers/${customer.id}`);

    return {
      status: "success",
      message: "Customer updated.",
      customerId: customer.id,
    };
  } catch (error) {
    reportCustomerError("update", error);

    return {
      status: "error",
      message: "We could not update the customer. Please try again.",
    };
  }
}

export async function archiveCustomer(
  customerId: string,
  _previousState: CustomerActionState,
  _formData: FormData,
): Promise<CustomerActionState> {
  void _previousState;
  void _formData;
  const { organization } = await requireOrganization({ behavior: "throw" });

  try {
    const archived = await archiveCustomerForOrganization(
      organization.id,
      customerId,
    );

    if (!archived) {
      return {
        status: "error",
        message: "The customer could not be archived.",
      };
    }

    revalidatePath("/customers");
    revalidatePath(`/customers/${customerId}`);

    return {
      status: "success",
      message: "Customer archived.",
      customerId,
    };
  } catch (error) {
    reportCustomerError("archive", error);

    return {
      status: "error",
      message: "We could not archive the customer. Please try again.",
    };
  }
}
