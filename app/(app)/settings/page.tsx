import Link from "next/link";
import { Building2, CircleHelp, FileText, UserRound } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireOrganization } from "@/lib/auth/access";

const roleLabels = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
} as const;

export default async function SettingsPage() {
  const { organization, membership, user } = await requireOrganization();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Review your workspace, account, and current quote defaults."
        actions={
          <Link href="/help" className={buttonVariants({ variant: "outline" })}>
            <CircleHelp className="size-4" aria-hidden="true" />
            Help &amp; support
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Building2 className="size-4" aria-hidden="true" />
              </span>
              <div>
                <CardTitle>Workspace</CardTitle>
                <CardDescription className="mt-1">
                  The organisation currently used for business data and quotes.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Business name</p>
              <p className="mt-1 break-words font-medium">
                {organization.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Your role</p>
              <p className="mt-1 font-medium">{roleLabels[membership.role]}</p>
            </div>
            <p className="rounded-lg border bg-muted/20 p-3 text-xs leading-5 text-muted-foreground">
              Workspace profile editing and branding are not enabled in the
              private-pilot MVP. The business name above is shown on public
              quotes and transactional emails.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                <UserRound className="size-4" aria-hidden="true" />
              </span>
              <div>
                <CardTitle>Account</CardTitle>
                <CardDescription className="mt-1">
                  The signed-in account for this QuoteVia session.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="mt-1 break-words font-medium">
                {user.name || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email address</p>
              <p className="mt-1 break-all font-medium">
                {user.email || "Not provided"}
              </p>
            </div>
            <p className="rounded-lg border bg-muted/20 p-3 text-xs leading-5 text-muted-foreground">
              Account profile editing and password reset are deliberately
              deferred until after private-pilot feedback.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <FileText className="size-4" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>Current quote defaults</CardTitle>
              <CardDescription className="mt-1">
                The behavior applied by the current MVP workflow.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-5 text-sm sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <dt className="text-xs text-muted-foreground">Currency</dt>
              <dd className="mt-1 font-medium">ZAR — South African rand</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Validity</dt>
              <dd className="mt-1 font-medium">Chosen on each quote</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Tax</dt>
              <dd className="mt-1 font-medium">Set per catalog or line item</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Quote number</dt>
              <dd className="mt-1 font-medium">Generated automatically</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
