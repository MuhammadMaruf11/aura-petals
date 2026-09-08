import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  pageCount,
  basePath,
  searchParams,
}: {
  page: number;
  pageCount: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;

  function hrefFor(targetPage: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") params.set(key, value);
    }
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav className="mt-10 flex justify-center gap-1" aria-label="Pagination">
      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          className={cn(
            "flex size-9 items-center justify-center rounded-full text-sm",
            p === page ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
          )}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
