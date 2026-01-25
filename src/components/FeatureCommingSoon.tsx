"use client";

import { Construction } from "lucide-react";

export default function FeatureComingSoon({
  title = "Feature Coming Soon",
  description = "We’re actively working on this feature. It will be available in a future update.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Construction className="h-8 w-8 text-muted-foreground" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

        <p className="mt-3 text-sm text-muted-foreground">{description}</p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs text-muted-foreground">
          🚧 Under development
        </div>
      </div>
    </div>
  );
}
