import { expect } from "@esm-bundle/chai";

import "../checkbox/checkbox.js";
import "../table/table.js";
import "./bulk-actions-bar.js";

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

function clickRowanButton(button) {
  const nativeButton = button.shadowRoot.querySelector("button");
  expect(nativeButton).to.not.equal(null);
  nativeButton.click();
}

describe("rowan-bulk-actions-bar", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("shows selected rows and emits rowan-bulk-action for a configured action", async () => {
    const table = createTable();
    const bar = document.createElement("rowan-bulk-actions-bar");
    bar.slot = "toolbar";
    bar.actions = [{ id: "archive", label: "Archive", variant: "secondary" }];
    table.append(bar);

    document.body.append(table);
    await settle();

    const checkbox = table.shadowRoot.querySelector(
      'tbody tr td[data-column-id="__select"] rowan-checkbox',
    );
    expect(checkbox).to.not.equal(null);
    await nextMicrotask();

    clickCheckboxInput(checkbox);
    await settle();

    let detail = null;
    let eventMeta = null;
    bar.addEventListener("rowan-bulk-action", (event) => {
      detail = event.detail;
      eventMeta = { bubbles: event.bubbles, composed: event.composed };
    });

    const action = bar.shadowRoot.querySelector('[data-bulk-action="archive"]');
    clickRowanButton(action);
    await settle();

    expect(bar.shadowRoot.querySelector('[part="bar"]').hidden).to.equal(false);
    expect(bar.selectedRows.map((row) => row.id)).to.deep.equal(["order-1"]);
    expect(detail.action).to.equal("archive");
    expect(detail.selected).to.deep.equal(["order-1"]);
    expect(detail.selectedRows.map((row) => row.name)).to.deep.equal(["Maple"]);
    expect(eventMeta).to.deep.equal({ bubbles: true, composed: true });
  });

  it("clears the target table selection only from a user action", async () => {
    const table = createTable();
    const bar = document.createElement("rowan-bulk-actions-bar");
    bar.forTable = "orders-table";

    document.body.append(table, bar);
    await settle();

    table.selected = ["order-1", "order-2"];
    await settle();

    let detail = null;
    let eventMeta = null;
    bar.addEventListener("rowan-clear-selection", (event) => {
      detail = event.detail;
      eventMeta = { bubbles: event.bubbles, composed: event.composed };
    });

    clickRowanButton(bar.shadowRoot.querySelector('[data-action="clear"]'));
    await settle();

    expect(table.selected).to.deep.equal([]);
    expect(bar.selectedCount).to.equal(0);
    expect(detail.selected).to.deep.equal(["order-1", "order-2"]);
    expect(eventMeta).to.deep.equal({ bubbles: true, composed: true });
    expect(getComputedStyle(bar.shadowRoot.querySelector('[part="bar"]')).display).to.equal("none");
  });

  it("emits rowan-bulk-action for a marked slotted control", async () => {
    const table = createTable();
    const bar = document.createElement("rowan-bulk-actions-bar");
    bar.slot = "toolbar";

    const exportButton = document.createElement("rowan-button");
    exportButton.setAttribute("data-bulk-action", "export-csv");
    exportButton.textContent = "Export CSV";
    bar.append(exportButton);
    table.append(bar);

    document.body.append(table);
    await settle();

    table.selected = ["order-2"];
    await settle();

    let detail = null;
    bar.addEventListener("rowan-bulk-action", (event) => {
      detail = event.detail;
    });

    clickRowanButton(exportButton);
    await settle();

    expect(detail.action).to.equal("export-csv");
    expect(detail.selected).to.deep.equal(["order-2"]);
    expect(detail.selectedRows.map((row) => row.name)).to.deep.equal(["Cedar"]);
  });

  it("reflects primitive configuration and applies default a11y", async () => {
    const bar = document.createElement("rowan-bulk-actions-bar");
    bar.forTable = "orders-table";
    bar.label = "Order actions";
    bar.disabled = true;

    document.body.append(bar);
    await settle();

    expect(bar.getAttribute("for-table")).to.equal("orders-table");
    expect(bar.disabled).to.equal(true);
    expect(bar.internals.role).to.equal("toolbar");
    expect(bar.internals.ariaLabel).to.equal("Order actions");
    expect(bar.internals.ariaDisabled).to.equal("true");
  });
});
