import "./bulk-actions-bar.js";
import "../button/button.js";
import "../table/table.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const ROWS = [
  { id: "1", name: "Ada", state: "Active" },
  { id: "2", name: "Alan", state: "Active" },
  { id: "3", name: "Grace", state: "Paused" },
];

function createTable() {
  const table = document.createElement("rowan-table");
  table.config = {
    caption: "Workspace members",
    rowId: "id",
    selectable: "multiple",
    columns: [
      { id: "name", header: "Name", type: "text" },
      { id: "state", header: "State", type: "text" },
    ],
    rows: ROWS.map((row) => ({ ...row })),
  };
  return table;
}

function createBar(actions) {
  const bar = document.createElement("rowan-bulk-actions-bar");
  bar.slot = "toolbar";
  bar.label = "Member actions";
  bar.actions = actions;
  return bar;
}

export default {
  title: "Components/Bulk Actions Bar",
  component: "rowan-bulk-actions-bar",
  tags: ["autodocs"],
  argTypes: {
    selectionLabel: { control: "text" },
    clearLabel: { control: "text" },
    actions: { control: "object" },
  },
  args: {
    selectionLabel: "selected",
    clearLabel: "Clear selection",
    actions: [
      { id: "archive", label: "Archive", variant: "secondary" },
      { id: "assign", label: "Assign owner" },
      { id: "remove", label: "Remove", variant: "danger" },
    ],
  },
};

export const ConfiguredActions = {
  parameters: createEventScriptParameters({
    steps: [
      "Select one or more rows to reveal the action bar.",
      "Activate a configured action.",
      "Clear the selection with the built-in action.",
    ],
    events: ["rowan-select", "rowan-bulk-action", "rowan-clear-selection"],
  }),
  render: ({ actions, selectionLabel, clearLabel }) => {
    const table = createTable();
    const bar = createBar(actions);
    bar.selectionLabel = selectionLabel;
    bar.clearLabel = clearLabel;
    table.append(bar);
    return table;
  },
};

export const CustomSlotAction = {
  render: () => {
    const table = createTable();
    const bar = createBar([]);
    const exportButton = document.createElement("rowan-button");
    exportButton.setAttribute("data-bulk-action", "export-csv");
    exportButton.variant = "secondary";
    exportButton.textContent = "Export CSV";
    bar.append(exportButton);
    table.append(bar);
    return table;
  },
};
