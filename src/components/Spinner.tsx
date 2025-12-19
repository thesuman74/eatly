export function Spinner({ label }: { label?: string }) {
  return (
    <div className="z-10 flex flex-col items-center justify-center gap-2 py-6">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-muted border-t-primary" />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}
