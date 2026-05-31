import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function PageHeader({
  title,
  backHref = "/",
}: {
  title: string;
  backHref?: string;
}) {
  return (
    <header className="mb-6 flex items-center gap-3">
      <Link
        href={backHref}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-charcoal/15 bg-white hover:border-heritage"
        aria-label="Back"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>
      <h1 className="font-display text-2xl font-bold text-charcoal">{title}</h1>
    </header>
  );
}
