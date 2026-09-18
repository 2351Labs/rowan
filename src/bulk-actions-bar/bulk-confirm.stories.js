import "./bulk-actions-bar.js";
import "../table/table.js";
import "../table-toolbar/table-toolbar.js";
import "../dialog/dialog.js";
import "../button/button.js";
import "../select/select.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const DRIVERS = ["Unassigned", "M. Ortiz", "J. Patel", "A. Nguyen", "R. Cole"];

function cloneRows() {
  return [
    { id: "WO-1042", asset: "Compressor C-14", assignee: "M. Ortiz", flagged: false },
    { id: "WO-1038", asset: "Tank T-09", assignee: "J. Patel", flagged: false },
    { id: "WO-1031", asset: "Separator S-3", assignee: "Unassigned", flagged: false },
    { id: "WO-1026", asset: "Meter skid MS-2", assignee: "A. Nguyen", flagged: false },
  ];
}

function tableConfig(rows) {
  return {
    caption: "Work orders",
    captionVisuallyHidden: true,
    rowId: "id",
    selectable: "multiple",
    columns: [
      { id: "id", header: "WO", type: "text" },
      { id: "asset", header: "Asset", type: "text" },
      { id: "assignee", header: "Assignee", type: "text" },
      {
        id: "flagged",
        header: "Flag",
        format: (value) => (value ? "Flagged" : "—"),
      },
    ],
    rows,
  };
}

function createAlertDialog({ id, title, confirmLabel, confirmVariant = "primary" }) {
  const dialog = document.createElement("rowan-dialog");
  dialog.id = id;
  dialog.alert = true;

  const heading = document.createElement("span");
  heading.slot = "title";
  heading.textContent = title;

  const body = document.createElement("p");
  body.className = "confirm-body";

  const cancel = document.createElement("rowan-button");
  cancel.slot = "actions";
  cancel.variant = "secondary";
  cancel.textContent = "Cancel";
  cancel.addEventListener("rowan-click", () => dialog.hide());

  const confirm = document.createElement("rowan-button");
  confirm.slot = "actions";
  confirm.variant = confirmVariant;
  confirm.textContent = confirmLabel;

  dialog.append(heading, body, cancel, confirm);
  return { dialog, body, confirm };
}

export default {
  title: "Workflows/Bulk confirm",
  tags: ["autodocs"],
};

export const FlagAndAssign = {
  parameters: createEventScriptParameters({
    steps: [
      "Select one or more work orders.",
      "Choose Flag or Assign driver.",
      "Confirm or cancel in the alert dialog.",
    ],
    events: ["rowan-select", "rowan-bulk-action", "rowan-close"],
  }),
  render: () => {
    const rows = cloneRows();
    const wrapper = document.createElement("div");
    const table = document.createElement("rowan-table");
    table.config = tableConfig(rows);

    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    const density = document.createElement("span");
    density.slot = "end";
    density.textContent = "Density stays on the toolbar.";
    toolbar.append(density);

    const bar = document.createElement("rowan-bulk-actions-bar");
    bar.slot = "toolbar";
    bar.label = "Work order actions";
    bar.actions = [
      { id: "flag", label: "Flag", variant: "secondary" },
      { id: "assign", label: "Assign driver" },
    ];

    const flag = createAlertDialog({
      id: "flag-orders",
      title: "Flag selected work orders?",
      confirmLabel: "Flag",
      confirmVariant: "danger",
    });

    const assign = createAlertDialog({
      id: "assign-driver",
      title: "Assign a driver?",
      confirmLabel: "Assign",
    });
    const driverSelect = document.createElement("rowan-select");
    driverSelect.label = "Driver";
    driverSelect.options = DRIVERS.map((name) => ({ value: name, label: name }));
    driverSelect.value = DRIVERS[0];
    assign.body.replaceWith(driverSelect);

    function selectedIds() {
      return table.selected;
    }

    function applyRows(mutate) {
      const next = table.rows.map((row) => ({ ...row }));
      mutate(next);
      table.rows = next;
      table.clearSelection();
    }

    bar.addEventListener("rowan-bulk-action", (event) => {
      const ids = event.detail.selected;
      const count = ids.length;
      if (event.detail.action === "flag") {
        flag.body.textContent = `Flag ${count} selected work order${count === 1 ? "" : "s"}?`;
        flag.dialog.show();
        return;
      }
      if (event.detail.action === "assign") {
        assign.dialog.show();
      }
    });

    flag.confirm.addEventListener("rowan-click", () => {
      const ids = new Set(selectedIds());
      applyRows((next) => {
        next.forEach((row) => {
          if (ids.has(row.id)) row.flagged = true;
        });
      });
      flag.dialog.hide();
    });

    assign.confirm.addEventListener("rowan-click", () => {
      const ids = new Set(selectedIds());
      const driver = driverSelect.value || DRIVERS[0];
      applyRows((next) => {
        next.forEach((row) => {
          if (ids.has(row.id)) row.assignee = driver;
        });
      });
      assign.dialog.hide();
    });

    table.append(toolbar, bar);
    wrapper.append(table, flag.dialog, assign.dialog);
    return wrapper;
  },
};
