import { Inbox } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-charcoal/20 bg-white/50 py-16 text-center">
      <Inbox className="mb-3 h-10 w-10 text-charcoal/30" aria-hidden />
      <p className="text-charcoal/60">{message}</p>
    </div>
  );
}
