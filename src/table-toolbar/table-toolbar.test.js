import { expect } from "@esm-bundle/chai";

import { reconnectHost } from "../../test/host-lifecycle.js";
import "../bulk-actions-bar/bulk-actions-bar.js";
import "../checkbox/checkbox.js";
import "../filter-builder/filter-builder.js";
import "../table/table.js";
import "./table-toolbar.js";

const nextMicrotask = () => Promise.resolve();
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

async function waitForStyles(element) {
  const stylesheet = element.shadowRoot?.querySelector('link[rel="stylesheet"]');
  if (!stylesheet) return;

  const hasLoadedRules = () => {
    try {
      return Boolean(stylesheet.sheet?.cssRules.length);
    } catch (_error) {
      return false;
    }
  };

  for (let frame = 0; frame < 60; frame += 1) {
    if (hasLoadedRules()) return;
    await nextFrame();
  }

  throw new Error(`Styles did not apply within 60 animation frames for <${element.localName}>.`);
}

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

  it("keeps the view title and bulk actions on one toolbar band", async () => {
    const table = createTable();
    table.style.inlineSize = "40rem";
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    const title = document.createElement("span");
    title.slot = "start";
    title.textContent = "Open orders";
    toolbar.append(title);
    const bar = document.createElement("rowan-bulk-actions-bar");
    bar.slot = "toolbar";
    bar.actions = [{ id: "archive", label: "Archive", variant: "secondary" }];
    table.append(toolbar, bar);
    table.selected = ["order-1", "order-2"];
    document.body.append(table);
    await settle();
    await waitForStyles(table);
    await waitForStyles(toolbar);
    await waitForStyles(bar);

    const selectionText = bar.shadowRoot.querySelector('[part="selection-text"]');
    const toolbarBox = toolbar.getBoundingClientRect();
    const barBox = bar.getBoundingClientRect();
    const titleBox = title.getBoundingClientRect();

    expect(bar.shadowRoot.querySelector('[part="bar"]').hidden).to.equal(false);
    expect(toolbarBox.bottom).to.be.greaterThan(barBox.top);
    expect(barBox.bottom).to.be.greaterThan(toolbarBox.top);
    expect(titleBox.right).to.be.at.most(barBox.left + 1);
    expect(getComputedStyle(selectionText).paddingTop).to.equal("0px");
    expect(getComputedStyle(selectionText).backgroundColor).to.equal("rgba(0, 0, 0, 0)");
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
    expect(picker.localName).to.equal("rowan-dropdown");
    const trigger = picker.shadowRoot.querySelector("rowan-button");
    trigger.dispatchEvent(new CustomEvent("rowan-click", { bubbles: true, composed: true }));
    await settle();
    expect(picker.open).to.equal(true);
    const team = toolbar.shadowRoot.querySelector('input[data-column-id="team"]');
    team.checked = false;
    team.dispatchEvent(new Event("change", { bubbles: true }));
    await settle();

    expect(table.columns.find((column) => column.id === "team").hidden).to.equal(true);
    expect(table.shadowRoot.querySelector('th[data-column-id="team"]')).to.equal(null);

    const name = toolbar.shadowRoot.querySelector('input[data-column-id="name"]');
    expect(name.disabled).to.equal(true);
  });

  it("keeps column-picker changes after reconnecting", async () => {
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

    await reconnectHost(table);
    await settle();

    const team = toolbar.shadowRoot.querySelector('input[data-column-id="team"]');
    team.checked = false;
    team.dispatchEvent(new Event("change", { bubbles: true }));
    await settle();

    expect(table.columns.find((column) => column.id === "team").hidden).to.equal(true);
  });

  it("uses property-only messages for generated selection and column-picker copy", async () => {
    const table = createTable();
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    toolbar.columnPicker = true;
    table.append(toolbar);
    document.body.append(table);
    await settle();

    toolbar.messages = {
      columnPickerLabel: "Spalten",
      selectionStatus: "{count} ausgewahlt",
      visibleColumnsLabel: "Sichtbare Spalten",
    };
    table.selected = ["order-1"];
    await settle();

    expect(toolbar.getAttribute("messages")).to.equal(null);
    expect(toolbar.shadowRoot.querySelector('[part="selection-text"]').textContent).to.equal(
      "1 ausgewahlt",
    );
    expect(toolbar.shadowRoot.querySelector(".column-picker").label).to.equal("Spalten");
    expect(
      toolbar.shadowRoot.querySelector(".column-picker-menu").getAttribute("aria-label"),
    ).to.equal("Sichtbare Spalten");
  });

  it("drops nested filter-builder card chrome", async () => {
    const table = createTable();
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    const builder = document.createElement("rowan-filter-builder");
    toolbar.append(builder);
    table.append(toolbar);
    document.body.append(table);
    await settle();
    await waitForStyles(table);
    await waitForStyles(toolbar);
    await waitForStyles(builder);

    expect(getComputedStyle(builder).borderWidth).to.equal("0px");

    const standalone = document.createElement("rowan-filter-builder");
    document.body.append(standalone);
    await settle();
    await waitForStyles(standalone);

    expect(getComputedStyle(standalone).borderWidth).to.not.equal("0px");
  });

  it("wraps a nested filter-builder onto a full second toolbar row", async () => {
    const table = createTable();
    table.style.inlineSize = "40rem";
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    const title = document.createElement("span");
    title.slot = "start";
    title.textContent = "Open orders";
    const builder = document.createElement("rowan-filter-builder");
    toolbar.append(title, builder);
    table.append(toolbar);
    document.body.append(table);
    await settle();
    await waitForStyles(table);
    await waitForStyles(toolbar);
    await waitForStyles(builder);

    const content = toolbar.shadowRoot.querySelector('[part="content"]');
    const titleBox = title.getBoundingClientRect();
    const builderBox = builder.getBoundingClientRect();
    const toolbarBox = toolbar.getBoundingClientRect();

    expect(toolbar.hasAttribute("data-has-filter-builder")).to.equal(true);
    expect(getComputedStyle(content).flexBasis).to.equal("100%");
    expect(getComputedStyle(content).order).to.equal("1");
    expect(builderBox.top).to.be.greaterThan(titleBox.bottom - 1);
    expect(builderBox.width).to.be.above(toolbarBox.width * 0.75);

    builder.remove();
    await settle();

    expect(toolbar.hasAttribute("data-has-filter-builder")).to.equal(false);
    expect(getComputedStyle(content).order).to.equal("0");
  });

  it("keeps a toolbar-appearance filter-builder on the title row", async () => {
    const table = createTable();
    table.style.inlineSize = "40rem";
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    const title = document.createElement("span");
    title.slot = "start";
    title.textContent = "Open orders";
    const builder = document.createElement("rowan-filter-builder");
    builder.appearance = "toolbar";
    builder.fields = [{ id: "name", label: "Name" }];
    builder.filters = [{ id: "name-filter", field: "name", operator: "contains", value: "Ada" }];
    toolbar.append(title, builder);
    table.append(toolbar);
    document.body.append(table);
    await settle();
    await waitForStyles(table);
    await waitForStyles(toolbar);
    await waitForStyles(builder);

    const content = toolbar.shadowRoot.querySelector('[part="content"]');
    const titleBox = title.getBoundingClientRect();
    const builderBox = builder.getBoundingClientRect();

    expect(toolbar.hasAttribute("data-has-filter-builder")).to.equal(false);
    expect(getComputedStyle(content).flexBasis).to.not.equal("100%");
    expect(builderBox.top).to.be.lessThan(titleBox.bottom + 1);
    expect(builderBox.bottom).to.be.greaterThan(titleBox.top - 1);

    builder.appearance = "panel";
    await settle();
    await waitForStyles(builder);

    expect(toolbar.hasAttribute("data-has-filter-builder")).to.equal(true);
    expect(getComputedStyle(content).flexBasis).to.equal("100%");
    expect(builder.getBoundingClientRect().top).to.be.greaterThan(
      title.getBoundingClientRect().bottom - 1,
    );
  });

  it("keeps a nested filter-builder full-width when bulk actions share the slot", async () => {
    const table = createTable();
    table.style.inlineSize = "40rem";
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    const title = document.createElement("span");
    title.slot = "start";
    title.textContent = "Open orders";
    const builder = document.createElement("rowan-filter-builder");
    toolbar.append(title, builder);
    const bar = document.createElement("rowan-bulk-actions-bar");
    bar.slot = "toolbar";
    bar.actions = [{ id: "archive", label: "Archive", variant: "secondary" }];
    table.append(toolbar, bar);
    table.selected = ["order-1", "order-2"];
    document.body.append(table);
    await settle();
    await waitForStyles(table);
    await waitForStyles(toolbar);
    await waitForStyles(builder);
    await waitForStyles(bar);

    const tableBox = table.getBoundingClientRect();
    const toolbarBox = toolbar.getBoundingClientRect();
    const builderBox = builder.getBoundingClientRect();
    const barBox = bar.getBoundingClientRect();
    const titleBox = title.getBoundingClientRect();

    expect(toolbarBox.width).to.be.above(tableBox.width * 0.75);
    expect(builderBox.top).to.be.greaterThan(titleBox.bottom - 1);
    expect(barBox.top).to.be.greaterThan(builderBox.bottom - 1);
  });
});
