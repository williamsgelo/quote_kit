import { Card, CardContent } from "@/components/ui/card";

export function LoadingState() {
  return (
    <div className="animate-pulse space-y-6" aria-label="Loading content">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-md bg-muted" />
        <div className="h-4 w-80 max-w-full rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 p-5">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-8 w-32 rounded bg-muted" />
              <div className="h-3 w-36 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="h-80 rounded-xl border bg-muted/50" />
    </div>
  );
}
