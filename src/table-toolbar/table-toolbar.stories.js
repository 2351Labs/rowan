import "./table-toolbar.js";
import "../badge/badge.js";
import "../bulk-actions-bar/bulk-actions-bar.js";
import "../button/button.js";
import "../table/table.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const ROWS = [
  { id: "1", name: "Ada", team: "Platform", role: "Engineer" },
  { id: "2", name: "Alan", team: "Research", role: "Scientist" },
  { id: "3", name: "Grace", team: "Operations", role: "Lead" },
];

function createTable() {
  const table = document.createElement("rowan-table");
  table.config = {
    caption: "Team members",
    captionVisuallyHidden: true,
    rowId: "id",
    selectable: "multiple",
    columns: [
      { id: "name", header: "Name", type: "text" },
      { id: "team", header: "Team", type: "text" },
      { id: "role", header: "Role", type: "text", hidden: true },
    ],
    rows: ROWS.map((row) => ({ ...row })),
  };
  return table;
}

function createToolbar({ label, selectionLabel, customSelection = false }) {
  const toolbar = document.createElement("rowan-table-toolbar");
  toolbar.slot = "toolbar";
  toolbar.label = label;
  toolbar.selectionLabel = selectionLabel;

  const viewLabel = document.createElement("span");
  viewLabel.slot = "start";
  viewLabel.textContent = "Active team members";
  toolbar.append(viewLabel);

  if (customSelection) {
    const badge = document.createElement("rowan-badge");
    badge.slot = "selection";
    badge.tone = "info";
    badge.size = "sm";
    badge.textContent = "Batch mode";
    toolbar.append(badge);
  }

  return toolbar;
}

export default {
  title: "Components/Data Display/Table Toolbar",
  component: "rowan-table-toolbar",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    selectionLabel: { control: "text" },
    columnPicker: { control: "boolean" },
  },
  args: {
    label: "Team table controls",
    selectionLabel: "selected",
    columnPicker: true,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: [
      "Select one or more table rows.",
      "Observe the selected-row status in the toolbar.",
      "Open Columns. Role starts hidden. Hide Team, then show it again.",
      "Hide Team from the Name column menu. The Columns checkbox follows that change.",
      "Clear selection with the table header checkbox.",
    ],
    events: ["rowan-select"],
  }),
  render: ({ label, selectionLabel, columnPicker }) => {
    const table = createTable();
    const toolbar = createToolbar({ label, selectionLabel });
    toolbar.columnPicker = Boolean(columnPicker);
    table.append(toolbar);
    return table;
  },
};

export const WithSelectionContent = {
  render: () => {
    const table = createTable();
    table.append(
      createToolbar({
        label: "Team table controls",
        selectionLabel: "members selected",
        customSelection: true,
      }),
    );
    return table;
  },
};

export const WithBulkActions = {
  render: () => {
    const table = createTable();
    const toolbar = createToolbar({ label: "Team table controls" });
    const bar = document.createElement("rowan-bulk-actions-bar");
    bar.slot = "toolbar";
    bar.actions = [{ id: "archive", label: "Archive", variant: "secondary" }];
    table.append(toolbar, bar);
    return table;
  },
};

export const ColumnsReplacedLater = {
  name: "Columns replaced later",
  parameters: createEventScriptParameters({
    steps: [
      "Columns lists Name, Team, and Role. Role starts unchecked.",
      "Choose Replace columns. The menu swaps to Order, Account, and Status.",
      "Status stays hidden until it is checked.",
    ],
    events: ["rowan-select"],
  }),
  render: () => {
    const table = createTable();
    const toolbar = createToolbar({ label: "Order controls", selectionLabel: "selected" });
    toolbar.columnPicker = true;
    const replace = document.createElement("rowan-button");
    replace.slot = "end";
    replace.variant = "secondary";
    replace.size = "sm";
    replace.type = "button";
    replace.textContent = "Replace columns";
    replace.addEventListener("rowan-click", () => {
      table.columns = [
        { id: "order", header: "Order", type: "text" },
        { id: "account", header: "Account", type: "text" },
        { id: "status", header: "Status", type: "text", hidden: true },
      ];
      table.rows = [
        { id: "1", order: "SO-1042", account: "Northwind", status: "Packed" },
        { id: "2", order: "SO-1048", account: "Contoso", status: "Held" },
        { id: "3", order: "SO-1051", account: "Fabrikam", status: "Shipped" },
      ];
    });
    toolbar.append(replace);
    table.append(toolbar);
    return table;
  },
};

export const LinkedTable = {
  name: "Linked table",
  render: () => {
    const table = createTable();
    table.id = "team-table";
    const toolbar = createToolbar({ label: "Team table controls" });
    toolbar.columnPicker = true;
    toolbar.forTable = "team-table";
    const end = document.createElement("span");
    end.slot = "end";
    end.textContent = "Export";
    toolbar.append(end);
    table.append(toolbar);
    return table;
  },
};
