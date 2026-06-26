"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { type MouseEvent, useState } from "react";

const TOTAL = 10;

// Page numbers to show, with "…" markers: always first + last, plus the current
// page and its neighbours; ellipsis fills the gaps.
function pageList(current: number, total: number): (number | "…")[] {
  const out: (number | "…")[] = [];
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || (p >= current - 1 && p <= current + 1)) {
      out.push(p);
    } else if (out[out.length - 1] !== "…") {
      out.push("…");
    }
  }
  return out;
}

export function PaginationDemo() {
  const [page, setPage] = useState(2);
  const go = (e: MouseEvent, p: number) => {
    e.preventDefault();
    setPage(Math.max(1, Math.min(TOTAL, p)));
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={(e) => go(e, page - 1)} />
        </PaginationItem>
        {pageList(page, TOTAL).map((p, i) =>
          p === "…" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href="#" isActive={p === page} onClick={(e) => go(e, p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext href="#" onClick={(e) => go(e, page + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
