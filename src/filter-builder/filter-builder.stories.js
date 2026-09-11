import "./filter-builder.js";
import "../table/table.js";
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
  return ROWS.filter((row) =>
    filters.every((filter) => {
      const value = String(row[filter.field] ?? "").toLowerCase();
      const expected = String(filter.value ?? "").toLowerCase();

      if (filter.operator === "is-empty") return value.length === 0;
      if (filter.operator === "is-not-empty") return value.length > 0;
      if (filter.operator === "equals") return value === expected;
      if (filter.operator === "not-equals") return value !== expected;
      if (filter.operator === "starts-with") return value.startsWith(expected);
      if (filter.operator === "ends-with") return value.endsWith(expected);
      return value.includes(expected);
    }),
  );
}

export default {
  title: "Components/Filter Builder",
  component: "rowan-filter-builder",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    fields: { control: "object" },
    filters: { control: "object" },
  },
  args: {
    label: "Filters",
    fields: FIELDS,
    filters: [{ id: "role-filter", field: "role", operator: "equals", value: "Editor" }],
  },
};

export const ControlledTable = {
  parameters: createEventScriptParameters({
    steps: [
      "Change an existing filter value.",
      "Add a filter and choose a field, operator, and value.",
      "Observe the table update through consumer-owned row state.",
    ],
    events: ["rowan-filter-change"],
  }),
  render: ({ label, fields, filters }) => {
    const table = createTable();
    const builder = document.createElement("rowan-filter-builder");
    builder.slot = "toolbar";
    builder.label = label;
    builder.fields = fields;
    builder.filters = filters;

    builder.addEventListener("rowan-filter-change", (event) => {
      table.rows = filterRows(event.detail.filters).map((row) => ({ ...row }));
    });

    table.rows = filterRows(builder.filters).map((row) => ({ ...row }));
    table.append(builder);
    return table;
  },
};

export const InferredTableFields = {
  render: () => {
    const table = createTable();
    const builder = document.createElement("rowan-filter-builder");
    builder.slot = "toolbar";
    table.append(builder);
    return table;
  },
};
