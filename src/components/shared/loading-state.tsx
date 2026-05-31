export function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-heritage border-t-transparent" />
      <p className="mt-3 text-sm text-charcoal/60">{label}</p>
    </div>
  );
}
