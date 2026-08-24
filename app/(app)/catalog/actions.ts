"use server";

import { revalidatePath } from "next/cache";

import { requireOrganization } from "@/lib/auth/access";
import {
  archiveCatalogItemForOrganization,
  createCatalogItemForOrganization,
  updateCatalogItemForOrganization,
} from "@/lib/catalog/service";
import {
  catalogItemSchema,
  type CatalogItemInput,
} from "@/lib/validation/catalog-item";

export type CatalogItemActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  catalogItemId?: string;
  fieldErrors?: Partial<Record<keyof CatalogItemInput, string[]>>;
};

function catalogItemPayload(formData: FormData) {
  return {
    name: formData.get("name"),
    description: formData.get("description"),
    sku: formData.get("sku"),
    unit: formData.get("unit"),
    unitPrice: formData.get("unitPrice"),
    taxRate: formData.get("taxRate"),
  };
}

function validationError(
  error: ReturnType<typeof catalogItemSchema.safeParse> & { success: false },
): CatalogItemActionState {
  return {
    status: "error",
    message: "Check the highlighted fields and try again.",
    fieldErrors: error.error.flatten().fieldErrors,
  };
}

function reportCatalogError(operation: string, error: unknown) {
  console.error(
    `[catalog] ${operation} failed: ${
      error instanceof Error ? error.name : "UnknownError"
    }`,
  );
}

export async function createCatalogItem(
  _previousState: CatalogItemActionState,
  formData: FormData,
): Promise<CatalogItemActionState> {
  const { organization } = await requireOrganization({ behavior: "throw" });
  const parsedItem = catalogItemSchema.safeParse(catalogItemPayload(formData));

  if (!parsedItem.success) {
    return validationError(parsedItem);
  }

  try {
    const item = await createCatalogItemForOrganization(
      organization.id,
      parsedItem.data,
    );

    revalidatePath("/catalog");

    return {
      status: "success",
      message: "Catalog item created.",
      catalogItemId: item.id,
    };
  } catch (error) {
    reportCatalogError("create", error);

    return {
      status: "error",
      message: "We could not create the catalog item. Please try again.",
    };
  }
}

export async function updateCatalogItem(
  catalogItemId: string,
  _previousState: CatalogItemActionState,
  formData: FormData,
): Promise<CatalogItemActionState> {
  const { organization } = await requireOrganization({ behavior: "throw" });
  const parsedItem = catalogItemSchema.safeParse(catalogItemPayload(formData));

  if (!parsedItem.success) {
    return validationError(parsedItem);
  }

  try {
    const item = await updateCatalogItemForOrganization(
      organization.id,
      catalogItemId,
      parsedItem.data,
    );

    if (!item) {
      return {
        status: "error",
        message: "The catalog item could not be updated.",
      };
    }

    revalidatePath("/catalog");
    revalidatePath(`/catalog/${item.id}/edit`);

    return {
      status: "success",
      message: "Catalog item updated.",
      catalogItemId: item.id,
    };
  } catch (error) {
    reportCatalogError("update", error);

    return {
      status: "error",
      message: "We could not update the catalog item. Please try again.",
    };
  }
}

export async function archiveCatalogItem(
  catalogItemId: string,
  _previousState: CatalogItemActionState,
  _formData: FormData,
): Promise<CatalogItemActionState> {
  void _previousState;
  void _formData;
  const { organization } = await requireOrganization({ behavior: "throw" });

  try {
    const archived = await archiveCatalogItemForOrganization(
      organization.id,
      catalogItemId,
    );

    if (!archived) {
      return {
        status: "error",
        message: "The catalog item could not be archived.",
      };
    }

    revalidatePath("/catalog");
    revalidatePath(`/catalog/${catalogItemId}/edit`);

    return {
      status: "success",
      message: "Catalog item archived.",
      catalogItemId,
    };
  } catch (error) {
    reportCatalogError("archive", error);

    return {
      status: "error",
      message: "We could not archive the catalog item. Please try again.",
    };
  }
}
