import { useRef } from "react";
import type * as React from "react";
import { useRowanElement } from "@rowan-ui/core/react";
import type { RowanTable } from "@rowan-ui/core/table";

type RowanTags = Extract<keyof HTMLElementTagNameMap, `rowan-${string}`>;
type Assert<T extends true> = T;
type AllRowanTagsAreTyped = Assert<
  Exclude<RowanTags, keyof React.JSX.IntrinsicElements> extends never ? true : false
>;

const tableConfig = {
  columns: [{ id: "name", header: "Name" }],
  rows: [{ id: "1", name: "Ada" }],
};
const comboboxOptions = [{ value: "ada", label: "Ada" }];

function TableView() {
  const tableRef = useRef<RowanTable>(null);
  const listRef = useRef<HTMLElementTagNameMap["rowan-virtual-list"]>(null);
  const comboboxRef = useRef<HTMLElementTagNameMap["rowan-combobox"]>(null);

  useRowanElement(tableRef, {
    properties: {
      config: tableConfig,
      columns: tableConfig.columns,
      rows: tableConfig.rows,
      selected: ["1"],
      sort: null,
      page: null,
      density: "lg",
      selectable: "multiple",
    },
    events: {
      "rowan-select": (event) => event.type,
    },
  });

  useRowanElement(tableRef, {
    properties: { config: null },
  });

  useRowanElement(listRef, {
    properties: {
      items: tableConfig.rows,
      renderItem: (_item, _index, itemElement) => itemElement,
      itemKey: null,
    },
  });

  useRowanElement(comboboxRef, {
    properties: { options: comboboxOptions },
  });

  useRowanElement(comboboxRef, {
    properties: {
      // @ts-expect-error Combobox options are strings or documented option records.
      options: [42],
    },
  });

  useRowanElement(tableRef, {
    properties: {
      // @ts-expect-error Rows must be an array of record values.
      rows: "not a row collection",
    },
  });

  useRowanElement(tableRef, {
    properties: {
      // @ts-expect-error Table selection supports none, single, and multiple only.
      selectable: "all",
    },
  });

  useRowanElement(listRef, {
    properties: {
      // @ts-expect-error Virtual List item keys are strings or key functions.
      itemKey: 1,
    },
  });

  return (
    <>
      <rowan-table ref={tableRef} caption="Team members" sticky-header virtual-item-size={44} />
      <rowan-button disabled size="sm" variant="primary">
        Save
      </rowan-button>
      <rowan-context-menu for="member-row" label="Member actions" />
      <rowan-virtual-list ref={listRef} />
      <rowan-combobox ref={comboboxRef} label="Member" />
    </>
  );
}

const structuredTablePropertyRequiresRef = (
  // @ts-expect-error Structured values must use useRowanElement().
  <rowan-table config={tableConfig} />
);
const invalidTableDensityAttribute = (
  // @ts-expect-error Table density supports sm, md, and lg only.
  <rowan-table density="compact" />
);

void TableView;
void (null as unknown as AllRowanTagsAreTyped);
void structuredTablePropertyRequiresRef;
void invalidTableDensityAttribute;
