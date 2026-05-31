"use client";

import { Loader2 } from "lucide-react";

export function AiTypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-xs text-charcoal/50">
      <Loader2 className="h-3.5 w-3.5 animate-spin text-heritage" />
      <span className="flex gap-1">
        <span className="animate-pulse">•</span>
        <span className="animate-pulse [animation-delay:150ms]">•</span>
        <span className="animate-pulse [animation-delay:300ms]">•</span>
      </span>
    </div>
  );
}
