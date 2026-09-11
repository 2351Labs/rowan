export const label = "Rowan";
export const scope = "Source ESM button, checkbox, and switch components";

function controlsAreRendered(container) {
  return [...container.children].every((control) => control.shadowRoot?.childElementCount > 0);
}

export async function loadFoundation() {
  await Promise.all([
    import("../../src/button/button.js"),
    import("../../src/checkbox/checkbox.js"),
    import("../../src/switch/switch.js"),
  ]);

  return {
    createControls() {
      const container = document.createElement("section");
      const button = document.createElement("rowan-button");
      const checkbox = document.createElement("rowan-checkbox");
      const switchControl = document.createElement("rowan-switch");

      button.type = "button";
      button.textContent = "Continue";
      checkbox.checked = true;
      checkbox.textContent = "Receive updates";
      switchControl.checked = true;
      switchControl.textContent = "Notifications";
      container.append(button, checkbox, switchControl);

      return container;
    },
    isRendered: controlsAreRendered,
  };
}

export async function loadTable() {
  await import("../../src/table/table.js");

  return {
    createTable(rows) {
      const table = document.createElement("rowan-table");
      table.config = {
        selectable: "multiple",
        rowId: "id",
        columns: [
          { id: "name", header: "Name", sortable: true },
          { id: "role", header: "Role" },
          { id: "quota", header: "Quota", type: "number", align: "end" },
        ],
        rows,
      };
      return table;
    },
  };
}
