import { expect } from "@esm-bundle/chai";

import "../bulk-actions-bar/bulk-actions-bar.js";
import "../checkbox/checkbox.js";
import "../table/table.js";
import "./table-toolbar.js";

const nextMicrotask = () => Promise.resolve();

async function settle() {
  await nextMicrotask();
  await nextMicrotask();
  await nextMicrotask();
}

function createTable() {
  const table = document.createElement("rowan-table");
  table.id = "orders-table";
  table.config = {
    rowId: "id",
    selectable: "multiple",
    columns: [{ id: "name", header: "Name", type: "text" }],
    rows: [
      { id: "order-1", name: "Maple" },
      { id: "order-2", name: "Cedar" },
    ],
  };
  return table;
}

function clickCheckboxInput(checkbox) {
  const input = checkbox.shadowRoot.querySelector('input[type="checkbox"]');
  expect(input).to.not.equal(null);
  input.click();
}

describe("rowan-table-toolbar", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("binds to an adjacent table and reflects user selection state", async () => {
    const table = createTable();
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    table.append(toolbar);

    document.body.append(table);
    await settle();

    const checkbox = table.shadowRoot.querySelector(
      'tbody tr td[data-column-id="__select"] rowan-checkbox',
    );
    expect(checkbox).to.not.equal(null);
    await nextMicrotask();

    clickCheckboxInput(checkbox);
    await settle();

    expect(toolbar.table).to.equal(table);
    expect(toolbar.selected).to.deep.equal(["order-1"]);
    expect(toolbar.selectedRows.map((row) => row.name)).to.deep.equal(["Maple"]);
    expect(toolbar.selectedCount).to.equal(1);

    const selection = toolbar.shadowRoot.querySelector('[part="selection"]');
    expect(selection.hidden).to.equal(false);
    expect(selection.textContent.trim()).to.equal("1 selected");
  });

  it("hides the toolbar selection count when a bulk-actions-bar owns the table", async () => {
    const table = createTable();
    const toolbar = document.createElement("rowan-table-toolbar");
    const bar = document.createElement("rowan-bulk-actions-bar");
    toolbar.slot = "toolbar";
    bar.slot = "toolbar";
    table.append(toolbar, bar);
    table.selected = ["order-1"];

    document.body.append(table);
    await settle();

    const selection = toolbar.shadowRoot.querySelector('[part="selection"]');
    expect(toolbar.selectedCount).to.equal(1);
    expect(selection.hidden).to.equal(true);
    expect(bar.selectedCount).to.equal(1);
    expect(bar.shadowRoot.querySelector('[part="selection-text"]').textContent).to.contain(
      "1 selected",
    );
  });

  it("synchronizes parent-driven table selection without a table event", async () => {
    const table = createTable();
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.forTable = "orders-table";

    document.body.append(table, toolbar);
    await settle();

    table.selected = ["order-1", "order-2"];
    await settle();

    expect(toolbar.selectedCount).to.equal(2);
    expect(toolbar.selectedRows.map((row) => row.id)).to.deep.equal(["order-1", "order-2"]);

    table.clearSelection();
    await settle();

    expect(toolbar.selected).to.deep.equal([]);
    const selection = toolbar.shadowRoot.querySelector('[part="selection"]');
    expect(selection.hidden).to.equal(true);
    expect(getComputedStyle(selection).display).to.equal("none");
  });

  it("binds a declarative table reference that becomes available later", async () => {
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.forTable = "missing-orders-table";

    document.body.append(toolbar);
    await settle();

    expect(toolbar.table).to.equal(null);

    toolbar.forTable = "late-orders-table";
    await settle();

    const table = createTable();
    table.id = "late-orders-table";
    document.body.append(table);
    await settle();

    table.selected = ["order-2"];
    await settle();

    expect(toolbar.table).to.equal(table);
    expect(toolbar.selected).to.deep.equal(["order-2"]);
    expect(toolbar.selectedRows.map((row) => row.name)).to.deep.equal(["Cedar"]);
  });

  it("reflects its primitive table reference and applies default a11y", async () => {
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.forTable = "orders-table";
    toolbar.label = "Order controls";

    document.body.append(toolbar);
    await settle();

    expect(toolbar.getAttribute("for-table")).to.equal("orders-table");
    expect(toolbar.internals.role).to.equal("toolbar");
    expect(toolbar.internals.ariaLabel).to.equal("Order controls");
  });

  it("toggles column.hidden from the optional column picker", async () => {
    const table = createTable();
    table.config = {
      ...table.config,
      columns: [
        { id: "name", header: "Name" },
        { id: "team", header: "Team" },
      ],
    };
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    toolbar.columnPicker = true;
    table.append(toolbar);
    document.body.append(table);
    await settle();

    const picker = toolbar.shadowRoot.querySelector(".column-picker");
    expect(picker.hidden).to.equal(false);
    const team = toolbar.shadowRoot.querySelector('input[data-column-id="team"]');
    team.checked = false;
    team.dispatchEvent(new Event("change", { bubbles: true }));
    await settle();

    expect(table.columns.find((column) => column.id === "team").hidden).to.equal(true);
    expect(table.shadowRoot.querySelector('th[data-column-id="team"]')).to.equal(null);

    const name = toolbar.shadowRoot.querySelector('input[data-column-id="name"]');
    expect(name.disabled).to.equal(true);
  });
});
