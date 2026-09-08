import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand px-4 py-16">
      <Link href="/" className="mb-8 font-heading text-2xl">
        Aura &amp; Petals
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
