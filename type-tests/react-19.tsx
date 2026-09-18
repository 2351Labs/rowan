import type * as React from "react";
import { RowanButton } from "@rowan-ui/core/react/button";
import { RowanCombobox } from "@rowan-ui/core/react/combobox";
import { RowanTable as Table } from "@rowan-ui/core/react/table";
import { RowanSparkline } from "@rowan-ui/core/react/sparkline";
import { RowanDonutChart } from "@rowan-ui/core/react/donut-chart";
import { RowanTrendChart } from "@rowan-ui/core/react/trend-chart";
import { RowanVirtualList } from "@rowan-ui/core/react/virtual-list";

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
  return (
    <>
      <rowan-table caption="Team members" sticky-header virtual-item-size={44} />
      <rowan-button disabled size="sm" variant="primary">
        Save
      </rowan-button>
      <RowanButton disabled size="sm" onRowanClick={() => undefined}>
        Save
      </RowanButton>
      <rowan-context-menu for="member-row" label="Member actions" />
      <rowan-virtual-list />
      <rowan-combobox label="Member" />
    </>
  );
}

const structuredTablePropertyRequiresWrapper = (
  // @ts-expect-error Structured values are wrapper props, not tag attributes.
  <rowan-table config={tableConfig} />
);
const invalidWrapperRows = (
  // @ts-expect-error Rows must be an array of record values.
  <Table rows="not a row collection" />
);
const invalidWrapperSelectable = (
  // @ts-expect-error Table selection supports none, single, and multiple only.
  <Table selectable="all" />
);
const invalidWrapperItemKey = (
  // @ts-expect-error Virtual List item keys are strings or key functions.
  <RowanVirtualList itemKey={1} />
);
const invalidComboboxOptions = (
  // @ts-expect-error Combobox options are strings or documented option records.
  <RowanCombobox options={[42]} />
);
const invalidTableDensityAttribute = (
  // @ts-expect-error Table density supports sm, md, and lg only.
  <rowan-table density="compact" />
);

const wrapperButton = (
  <RowanButton disabled={false} variant="primary" onRowanClick={(event) => event.type}>
    Save
  </RowanButton>
);
const invalidWrapperVariant = (
  // @ts-expect-error Button variant is primary, secondary, ghost, or danger.
  <RowanButton variant="loud" />
);
const wrapperTable = (
  <Table config={tableConfig} selected={["1"]} onRowanSelect={(event) => event.detail} />
);
const wrapperList = (
  <RowanVirtualList
    items={tableConfig.rows}
    renderItem={(_item, _index, itemElement) => itemElement}
  />
);
const wrapperChart = <RowanTrendChart series={[]} valueFormatter={(value) => String(value)} />;
const wrapperSparkline = (
  <RowanSparkline values={[4, 8, 3]} labels={["Mon", "Tue", "Wed"]} tone="success" />
);
const wrapperDonut = (
  <RowanDonutChart
    series={[{ id: "sources", label: "Sources", values: [12, 8] }]}
    labels={["App", "Phone"]}
  />
);
const wrapperCombobox = <RowanCombobox options={comboboxOptions} />;

void TableView;
void (null as unknown as AllRowanTagsAreTyped);
void structuredTablePropertyRequiresWrapper;
void invalidWrapperRows;
void invalidWrapperSelectable;
void invalidWrapperItemKey;
void invalidComboboxOptions;
void invalidTableDensityAttribute;
void wrapperButton;
void invalidWrapperVariant;
void wrapperTable;
void wrapperList;
void wrapperChart;
void wrapperSparkline;
void wrapperDonut;
void wrapperCombobox;
