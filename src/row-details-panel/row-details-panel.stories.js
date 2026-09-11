import "./row-details-panel.js";
import "../table/table.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const ROWS = [
  { id: "1", name: "Ada", team: "Platform", quota: 72 },
  { id: "2", name: "Alan", team: "Research", quota: 18 },
  { id: "3", name: "Grace", team: "Operations", quota: 94 },
];

function createTable() {
  const table = document.createElement("rowan-table");
  table.id = "member-details-table";
  table.config = {
    caption: "Workspace members",
    rowId: "id",
    columns: [
      { id: "name", header: "Name", type: "text" },
      { id: "team", header: "Team", type: "text" },
      { id: "quota", header: "Quota", type: "progress" },
    ],
    rows: ROWS.map((row) => ({ ...row })),
  };
  return table;
}

function createPanel() {
  const panel = document.createElement("rowan-row-details-panel");
  panel.forTable = "member-details-table";
  return panel;
}

export default {
  title: "Components/Row Details Panel",
  component: "rowan-row-details-panel",
  tags: ["autodocs"],
  argTypes: {
    side: { control: "inline-radio", options: ["start", "end"] },
    label: { control: "text" },
    fields: { control: "object" },
  },
  args: {
    side: "end",
    label: "Member details",
  },
};

export const FromTableActivation = {
  parameters: createEventScriptParameters({
    steps: [
      "Double-click a row or focus it and press Enter.",
      "Review the read-only row details in the panel.",
      "Close the panel with Escape, the backdrop, or the close control.",
    ],
    events: ["rowan-row-activate", "rowan-close"],
  }),
  render: ({ side, label }) => {
    const wrapper = document.createElement("div");
    const table = createTable();
    const panel = createPanel();
    panel.side = side;
    panel.label = label;
    wrapper.append(table, panel);
    return wrapper;
  },
};

export const ControlledRecord = {
  render: ({ side, label }) => {
    const panel = document.createElement("rowan-row-details-panel");
    panel.side = side;
    panel.label = label;
    panel.rowId = "3";
    panel.row = ROWS[2];
    panel.fields = [
      { id: "name", label: "Name" },
      { id: "team", label: "Team" },
      { id: "quota", label: "Usage", format: (value) => `${value}%` },
    ];
    panel.open = true;
    return panel;
  },
};
