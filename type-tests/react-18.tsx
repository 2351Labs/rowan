import { RowanTable as Table } from "@rowan-ui/core/react/table";
import { RowanVirtualList } from "@rowan-ui/core/react/virtual-list";

type RowanTags = Extract<keyof HTMLElementTagNameMap, `rowan-${string}`>;
type Assert<T extends true> = T;
type AllRowanTagsAreTyped = Assert<
  Exclude<RowanTags, keyof JSX.IntrinsicElements> extends never ? true : false
>;

const rows = [{ id: "1", name: "Ada" }];

function TableView() {
  return (
    <>
      <rowan-table caption="Team members" sticky-header />
      <rowan-form-field for="member-table" label="Members" />
      <rowan-virtual-list />
      <Table
        columns={[{ id: "name", header: "Name" }]}
        rows={rows}
        selected={["1"]}
        density="lg"
        selectable="multiple"
        onRowanSelect={(event) => event.type}
      />
      <RowanVirtualList
        items={rows}
        renderItem={(_item, _index, itemElement) => itemElement}
        itemKey={null}
      />
    </>
  );
}

const structuredTablePropertyRequiresWrapper = (
  // @ts-expect-error Structured values are wrapper props, not tag attributes.
  <rowan-table rows={rows} />
);
const invalidTableDensityAttribute = (
  // @ts-expect-error Table density supports sm, md, and lg only.
  <rowan-table density="compact" />
);
const invalidWrapperDensity = (
  // @ts-expect-error Table density supports sm, md, and lg only.
  <Table density="compact" />
);
const invalidWrapperRenderItem = (
  // @ts-expect-error Virtual List renderers are functions or null.
  <RowanVirtualList renderItem="render" />
);

void TableView;
void (null as unknown as AllRowanTagsAreTyped);
void structuredTablePropertyRequiresWrapper;
void invalidTableDensityAttribute;
void invalidWrapperDensity;
void invalidWrapperRenderItem;
