import { UserRoundX } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

export default function CustomerNotFound() {
  return (
    <EmptyState
      icon={UserRoundX}
      title="Customer not found"
      description="This customer is unavailable or does not belong to your organisation."
      action="Back to customers"
      actionHref="/customers"
    />
  );
}
