import { expect } from "@esm-bundle/chai";

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
});
