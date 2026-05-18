"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const items = ["C3 product", "Enterprise product", "Mobile app", "Internal tool", "Marketing site"];

export function ComboboxDemo() {
  return (
    <Combobox items={items}>
      <ComboboxInput placeholder="Search products…" className="w-56" />
      <ComboboxContent>
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
