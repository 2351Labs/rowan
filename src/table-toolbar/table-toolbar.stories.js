import "./table-toolbar.js";
import "../badge/badge.js";
import "../table/table.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const ROWS = [
  { id: "1", name: "Ada", team: "Platform" },
  { id: "2", name: "Alan", team: "Research" },
  { id: "3", name: "Grace", team: "Operations" },
];

function createTable() {
  const table = document.createElement("rowan-table");
  table.config = {
    caption: "Team members",
    rowId: "id",
    selectable: "multiple",
    columns: [
      { id: "name", header: "Name", type: "text" },
      { id: "team", header: "Team", type: "text" },
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
  title: "Components/Table Toolbar",
  component: "rowan-table-toolbar",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    selectionLabel: { control: "text" },
  },
  args: {
    label: "Team table controls",
    selectionLabel: "selected",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: [
      "Select one or more table rows.",
      "Observe the selected-row status in the toolbar.",
      "Clear selection with the table header checkbox.",
    ],
    events: ["rowan-select"],
  }),
  render: ({ label, selectionLabel }) => {
    const table = createTable();
    table.append(createToolbar({ label, selectionLabel }));
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
