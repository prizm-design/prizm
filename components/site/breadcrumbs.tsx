import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Multi-level breadcrumb chain. The last item is rendered as plain text (current page); all
 * other items render as links if they carry an `href`. Used at the top of every RC3 extension-
 * pack page in place of a single back-link, so readers can see the full path and jump to any
 * ancestor in one click. Extension packs in general should mirror this pattern.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-fg-muted">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${i}-${item.label}`} className="flex items-center gap-x-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="font-medium transition-colors hover:text-fg">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-fg" : "font-medium"}>{item.label}</span>
              )}
              {!isLast && (
                <span className="text-fg-subtle" aria-hidden>
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
