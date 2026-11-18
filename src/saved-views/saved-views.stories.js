import "./saved-views.js";
import "../filter-builder/filter-builder.js";
import "../table-toolbar/table-toolbar.js";
import "../table/table.js";
import { createMemorySavedViewStorage } from "./saved-views.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const ORDERS = [
  { id: "SO-1042", order: "SO-1042", status: "Packed", owner: "Northwind", updated: "10m ago" },
  { id: "SO-1048", order: "SO-1048", status: "Held", owner: "Contoso", updated: "24m ago" },
  { id: "SO-1051", order: "SO-1051", status: "Shipped", owner: "Fabrikam", updated: "1h ago" },
  { id: "SO-1060", order: "SO-1060", status: "Packed", owner: "Northwind", updated: "2h ago" },
];

const FIELDS = [
  {
    id: "status",
    label: "Status",
    type: "select",
    options: ["Packed", "Held", "Shipped"],
  },
  {
    id: "owner",
    label: "Owner",
    type: "select",
    options: ["Northwind", "Contoso", "Fabrikam"],
  },
];

function createTable() {
  const table = document.createElement("rowan-table");
  table.id = "open-orders";
  table.config = {
    caption: "Open orders",
    captionVisuallyHidden: true,
    rowId: "id",
    density: "md",
    sort: { id: "updated", dir: "desc" },
    columns: [
      { id: "order", header: "Order" },
      { id: "status", header: "Status", type: "badge" },
      { id: "owner", header: "Owner" },
      { id: "updated", header: "Updated" },
    ],
    rows: ORDERS.map((row) => ({ ...row })),
  };
  return table;
}

function createViews({ share = "on", label = "Saved views", empty = false } = {}) {
  const views = document.createElement("rowan-saved-views");
  views.slot = "end";
  views.forTable = "open-orders";
  views.storageKey = "open-orders";
  views.label = label;
  views.share = share;
  views.shareParam = "view";
  views.storage = createMemorySavedViewStorage(
    empty
      ? []
      : [
          {
            id: "view-held",
            name: "Held orders",
            isDefault: true,
            updatedAt: Date.now(),
            state: {
              version: 2,
              density: "sm",
              sort: { id: "owner", dir: "asc" },
              filters: [{ field: "status", operator: "equals", value: "Held" }],
              visibleColumns: ["order", "status", "owner", "updated"],
            },
          },
          {
            id: "view-packed",
            name: "Packed at Northwind",
            isDefault: false,
            updatedAt: Date.now(),
            state: {
              version: 2,
              density: "md",
              filters: [
                {
                  join: "and",
                  filters: [
                    { field: "status", operator: "equals", value: "Packed" },
                    { field: "owner", operator: "equals", value: "Northwind" },
                  ],
                },
              ],
            },
          },
        ],
  );
  return views;
}

export default {
  title: "Components/Data Display/Saved Views",
  component: "rowan-saved-views",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    share: { control: "select", options: ["on", "off"] },
    shareParam: { control: "text" },
    storageKey: { control: "text" },
    forTable: { control: "text" },
  },
  args: {
    label: "Saved views",
    share: "on",
    shareParam: "view",
    storageKey: "open-orders",
    forTable: "open-orders",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: [
      "Open Saved views. Held orders is the default.",
      "Apply Packed at Northwind. The filter group is status AND owner.",
      "Press ArrowDown and ArrowUp to move between views, then Enter is not required: Tab reaches Rename, Default, Delete, and Link.",
      "Copy link writes the version 2 snapshot into the view query parameter.",
      "Rename a view, then delete it. Delete asks for confirmation first.",
    ],
    events: ["rowan-saved-views-change", "rowan-saved-view-apply", "rowan-saved-view-share"],
  }),
  render: ({ label, share, shareParam, storageKey, forTable }) => {
    const table = createTable();
    table.id = forTable || "open-orders";
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    toolbar.label = "Order controls";
    toolbar.forTable = table.id;
    const builder = document.createElement("rowan-filter-builder");
    builder.appearance = "toolbar";
    builder.fields = FIELDS;
    builder.filters = [{ id: "held", field: "status", operator: "equals", value: "Held" }];
    const views = createViews({ share, label });
    views.shareParam = shareParam || "view";
    views.storageKey = storageKey || "open-orders";
    views.forTable = table.id;
    const note = document.createElement("span");
    note.slot = "actions";
    note.textContent = "Shared with the floor team";
    views.append(note);
    toolbar.append(builder, views);
    table.append(toolbar);
    return table;
  },
};

export const Empty = {
  name: "Empty",
  render: () => {
    const table = createTable();
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    toolbar.label = "Order controls";
    const views = createViews({ empty: true, share: "off" });
    toolbar.append(views);
    table.append(toolbar);
    return table;
  },
};

export const ShareOff = {
  name: "Share off",
  render: () => {
    const table = createTable();
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    const views = createViews({ share: "off", label: "Plant views" });
    views.setAttribute("share", "off");
    views.setAttribute("share-param", "view");
    views.setAttribute("storage-key", "open-orders");
    views.setAttribute("for-table", "open-orders");
    toolbar.append(views);
    table.append(toolbar);
    return table;
  },
};
