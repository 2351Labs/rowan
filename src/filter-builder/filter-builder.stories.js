import "./filter-builder.js";
import { applyFilters } from "./apply-filters.js";
import "../table/table.js";
import "../table-toolbar/table-toolbar.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const ROWS = [
  { id: "1", name: "Ada", role: "Admin", active: true },
  { id: "2", name: "Alan", role: "Editor", active: false },
  { id: "3", name: "Grace", role: "Editor", active: true },
];

const FIELDS = [
  { id: "name", label: "Name" },
  { id: "role", label: "Role", options: ["Admin", "Editor"] },
  { id: "active", label: "Active", type: "boolean" },
];

function createTable() {
  const table = document.createElement("rowan-table");
  table.config = {
    caption: "Workspace members",
    rowId: "id",
    columns: [
      { id: "name", header: "Name", type: "text" },
      { id: "role", header: "Role", type: "text" },
      { id: "active", header: "Active", type: "switch" },
    ],
    rows: ROWS.map((row) => ({ ...row })),
  };
  return table;
}

function filterRows(filters) {
  return applyFilters(ROWS, filters, FIELDS);
}

export default {
  title: "Components/Data Display/Filter Builder",
  component: "rowan-filter-builder",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    appearance: { control: "select", options: ["panel", "toolbar"] },
    fields: { control: "object" },
    filters: { control: "object" },
  },
  args: {
    label: "Filters",
    appearance: "panel",
    fields: FIELDS,
    filters: [{ id: "role-filter", field: "role", operator: "equals", value: "Editor" }],
  },
};

export const ControlledTable = {
  args: { appearance: "toolbar" },
  parameters: createEventScriptParameters({
    steps: [
      "Click a chip to edit field, operator, and value in the popover.",
      "Remove a chip or add a filter from the bar.",
      "Observe the table update through consumer-owned row state.",
    ],
    events: ["rowan-filter-change"],
  }),
  render: ({ label, appearance, fields, filters }) => {
    const table = createTable();
    table.config = { ...table.config, captionVisuallyHidden: true };
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    const title = document.createElement("span");
    title.slot = "start";
    title.textContent = "Workspace members";
    const builder = document.createElement("rowan-filter-builder");
    builder.appearance = appearance;
    builder.label = label;
    builder.fields = fields;
    builder.filters = filters;

    builder.addEventListener("rowan-filter-change", (event) => {
      table.rows = filterRows(event.detail.filters).map((row) => ({ ...row }));
    });

    table.rows = filterRows(builder.filters).map((row) => ({ ...row }));
    toolbar.append(title, builder);
    table.append(toolbar);
    return table;
  },
};

export const InferredTableFields = {
  render: () => {
    const table = createTable();
    table.config = { ...table.config, captionVisuallyHidden: true };
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    const title = document.createElement("span");
    title.slot = "start";
    title.textContent = "Workspace members";
    const builder = document.createElement("rowan-filter-builder");
    builder.appearance = "toolbar";
    toolbar.append(title, builder);
    table.append(toolbar);
    return table;
  },
};

export const NestedGroups = {
  parameters: createEventScriptParameters({
    steps: [
      "Change the group conjunction from Match any to Match all.",
      "Add a filter inside the group.",
      "Observe the table update through consumer-owned row state.",
    ],
    events: ["rowan-filter-change"],
  }),
  render: () => {
    const table = createTable();
    const builder = document.createElement("rowan-filter-builder");
    builder.slot = "toolbar";
    builder.fields = FIELDS;
    builder.filters = [
      {
        id: "role-group",
        join: "or",
        filters: [
          { id: "admin-filter", field: "role", operator: "equals", value: "Admin" },
          { id: "editor-filter", field: "role", operator: "equals", value: "Editor" },
        ],
      },
      { id: "active-filter", field: "active", operator: "equals", value: "true" },
    ];

    builder.addEventListener("rowan-filter-change", (event) => {
      table.rows = filterRows(event.detail.filters).map((row) => ({ ...row }));
    });

    table.rows = filterRows(builder.filters).map((row) => ({ ...row }));
    table.append(builder);
    return table;
  },
};
