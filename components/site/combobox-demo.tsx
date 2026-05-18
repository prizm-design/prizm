"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";

const items = [
  "C3 product",
  "Enterprise product",
  "Mobile app",
  "Internal tool",
  "Marketing site",
];

export function ComboboxDemo() {
  return (
    <Combobox items={items}>
      <ComboboxTrigger className="w-56" />
      <ComboboxContent>
        <div className="border-b border-border p-2">
          <ComboboxInput placeholder="Search products…" className="h-8 shadow-none" />
        </div>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>No results.</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
}
