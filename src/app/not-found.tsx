import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-heritage">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-charcoal">
        Бет табылмады
      </h1>
      <p className="mt-2 max-w-md text-sm text-charcoal/60">
        Бұл сілтеме ескірген немесе жойылған. Басты бетке оралыңыз.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Басты бетке
      </Link>
    </div>
  );
}
