import { ImagePlus } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const labelStyles = "text-sm font-medium";
const fieldStyles = "space-y-1.5";
const selectStyles =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your workspace details and quote defaults."
        actions={
          <Button type="button" size="lg" className="h-9 px-3">
            Save changes
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business profile</CardTitle>
              <CardDescription>
                Information shown on your quotes and customer documents.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className={fieldStyles}>
                <label htmlFor="business-name" className={labelStyles}>
                  Business name
                </label>
                <Input id="business-name" defaultValue="Northstar Studio" />
              </div>
              <div className={fieldStyles}>
                <label htmlFor="registration" className={labelStyles}>
                  Registration number
                </label>
                <Input id="registration" defaultValue="2022/548316/07" />
              </div>
              <div className={fieldStyles}>
                <label htmlFor="business-email" className={labelStyles}>
                  Business email
                </label>
                <Input
                  id="business-email"
                  type="email"
                  defaultValue="hello@northstar.co.za"
                />
              </div>
              <div className={fieldStyles}>
                <label htmlFor="business-phone" className={labelStyles}>
                  Phone number
                </label>
                <Input
                  id="business-phone"
                  type="tel"
                  defaultValue="+27 21 441 8830"
                />
              </div>
              <div className={`${fieldStyles} sm:col-span-2`}>
                <label htmlFor="business-address" className={labelStyles}>
                  Business address
                </label>
                <Textarea
                  id="business-address"
                  defaultValue={"41 Bree Street\nCape Town, Western Cape, 8001"}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quote preferences</CardTitle>
              <CardDescription>
                Set defaults for new quotes. You can still change these per
                quote.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className={fieldStyles}>
                <label htmlFor="currency" className={labelStyles}>
                  Default currency
                </label>
                <select id="currency" className={selectStyles} defaultValue="ZAR">
                  <option value="ZAR">ZAR — South African Rand</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                </select>
              </div>
              <div className={fieldStyles}>
                <label htmlFor="validity" className={labelStyles}>
                  Default validity
                </label>
                <select
                  id="validity"
                  className={selectStyles}
                  defaultValue="14"
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>
              <div className={fieldStyles}>
                <label htmlFor="tax-rate" className={labelStyles}>
                  Default tax rate
                </label>
                <div className="relative">
                  <Input
                    id="tax-rate"
                    type="number"
                    defaultValue="15"
                    className="pr-9"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
              <div className={fieldStyles}>
                <label htmlFor="tax-label" className={labelStyles}>
                  Tax label
                </label>
                <Input id="tax-label" defaultValue="VAT" />
              </div>
              <div className={fieldStyles}>
                <label htmlFor="quote-prefix" className={labelStyles}>
                  Quote number prefix
                </label>
                <Input id="quote-prefix" defaultValue="QK-" />
              </div>
              <div className={fieldStyles}>
                <label htmlFor="next-number" className={labelStyles}>
                  Next quote number
                </label>
                <Input id="next-number" type="number" defaultValue="1049" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>
                Add your logo to customer-facing quotes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button
                type="button"
                className="flex aspect-square w-full flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 text-center transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-10 items-center justify-center rounded-lg border bg-background shadow-xs">
                  <ImagePlus
                    className="size-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-3 text-sm font-medium">Upload logo</span>
                <span className="mt-1 px-4 text-xs text-muted-foreground">
                  PNG, JPG or SVG up to 2 MB
                </span>
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>
                Your current organisation details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Workspace name</p>
                <p className="mt-1 font-medium">Northstar Studio</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Workspace ID</p>
                <p className="mt-1 font-mono text-xs">ws_northstar_01</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Plan</p>
                <p className="mt-1 font-medium">QuoteKit Pro</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
