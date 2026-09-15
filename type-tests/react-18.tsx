import { useRef } from "react";
import { useRowanElement } from "@rowan-ui/core/react";
import type { RowanTable } from "@rowan-ui/core/table";

type RowanTags = Extract<keyof HTMLElementTagNameMap, `rowan-${string}`>;
type Assert<T extends true> = T;
type AllRowanTagsAreTyped = Assert<
  Exclude<RowanTags, keyof JSX.IntrinsicElements> extends never ? true : false
>;

const rows = [{ id: "1", name: "Ada" }];

function TableView() {
  const tableRef = useRef<RowanTable>(null);
  const listRef = useRef<HTMLElementTagNameMap["rowan-virtual-list"]>(null);

  useRowanElement(tableRef, {
    properties: {
      columns: [{ id: "name", header: "Name" }],
      rows,
      selected: ["1"],
      config: null,
      sort: null,
      page: null,
      density: "lg",
      selectable: "multiple",
    },
    events: {
      "rowan-select": (event) => event.type,
    },
  });

  useRowanElement(listRef, {
    properties: {
      items: rows,
      renderItem: (_item, _index, itemElement) => itemElement,
      itemKey: null,
    },
  });

  useRowanElement(tableRef, {
    properties: {
      // @ts-expect-error Table density supports sm, md, and lg only.
      density: "compact",
    },
  });

  useRowanElement(listRef, {
    properties: {
      // @ts-expect-error Virtual List renderers are functions or null.
      renderItem: "render",
    },
  });

  return (
    <>
      <rowan-table ref={tableRef} caption="Team members" sticky-header />
      <rowan-form-field for="member-table" label="Members" />
      <rowan-virtual-list ref={listRef} />
    </>
  );
}

const structuredTablePropertyRequiresRef = (
  // @ts-expect-error Structured values must use useRowanElement().
  <rowan-table rows={rows} />
);
const invalidTableDensityAttribute = (
  // @ts-expect-error Table density supports sm, md, and lg only.
  <rowan-table density="compact" />
);

void TableView;
void (null as unknown as AllRowanTagsAreTyped);
void structuredTablePropertyRequiresRef;
void invalidTableDensityAttribute;
