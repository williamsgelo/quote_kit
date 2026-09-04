"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PrintTemplateButton() {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={() => window.print()}
      className="h-11 px-5 print:hidden"
    >
      <Printer className="size-4" aria-hidden="true" />
      Print / Save as PDF
    </Button>
  );
}
