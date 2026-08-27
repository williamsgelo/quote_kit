import { QuoteActivityType } from "@/generated/prisma/client";

const activityLabels: Record<QuoteActivityType, string> = {
  CREATED: "Quote created",
  UPDATED: "Draft updated",
  SENT: "Quote sent",
  VIEWED: "Customer viewed quote",
  ACCEPTED: "Customer accepted quote",
  DECLINED: "Customer declined quote",
};

export function quoteActivityLabel(type: QuoteActivityType) {
  return activityLabels[type];
}
