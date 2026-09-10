import { expect } from "@esm-bundle/chai";

import "../badge/badge.js";
import "../button/button.js";
import "../checkbox/checkbox.js";
import "./table.js";

const nextMicrotask = () => Promise.resolve();

function createConfig() {
  return {
    rowId: "id",
    columns: [
      { id: "name", header: "Name", type: "text" },
      {
        id: "profile",
        header: "Profile",
        type: "link",
        cell: {
          href: (value, row) => `/users/${row.id}`,
          label: (value) => value,
        },
      },
      {
        id: "role",
        header: "Role",
        type: "badge",
        cell: {
          tone: (value) => (value === "Admin" ? "warning" : "info"),
        },
      },
      { id: "active", header: "Active", type: "checkbox" },
      {
        id: "edit",
        header: "",
        type: "button",
        cell: { label: "Edit", variant: "secondary" },
      },
    ],
    rows: [
      { id: "1", name: "Ada", profile: "Open", role: "Admin", active: true },
      { id: "2", name: "Alan", profile: "Open", role: "Editor", active: false },
    ],
  };
}

function createStepFiveConfig() {
  return {
    rowId: "id",
    selectable: "multiple",
    page: { index: 0, size: 2, total: 3 },
    columns: [
      {
        id: "name",
        header: "Name",
        type: "link",
        sortable: true,
        cell: { href: (value, row) => `/users/${row.id}` },
      },
      { id: "score", header: "Score", type: "number", sortable: true },
      { id: "joined", header: "Joined", type: "date" },
      { id: "active", header: "Active", type: "switch", align: "center" },
      {
        id: "role",
        header: "Role",
        type: "chip",
        cell: { tone: (value) => (value === "Admin" ? "warning" : "info") },
      },
      {
        id: "quota",
        header: "Quota",
        type: "progress",
      },
      {
        id: "owner",
        header: "Owner",
        type: "avatar",
      },
      {
        id: "edit",
        header: "",
        type: "icon-button",
        cell: { label: "Edit", icon: "edit" },
      },
      {
        id: "price",
        header: "Price",
        type: "custom",
        cell: { slot: "price-cell" },
      },
    ],
    rows: [
      {
        id: "1",
        name: "Zara",
        score: 8,
        joined: "2026-01-01",
        active: true,
        role: "Admin",
        quota: 72,
        owner: "Zara",
        price: "$10",
      },
      {
        id: "2",
        name: "Ada",
        score: 21,
        joined: "2026-03-02",
        active: false,
        role: "Editor",
        quota: 31,
        owner: "Ada",
        price: "$25",
      },
      {
        id: "3",
        name: "Alan",
        score: 13,
        joined: "2026-02-14",
        active: true,
        role: "Editor",
        quota: 54,
        owner: "Alan",
        price: "$14",
      },
    ],
  };
}

function clickCheckboxInput(checkbox) {
  const input = checkbox.shadowRoot.querySelector('input[type="checkbox"]');
  expect(input).to.not.equal(null);
  input.click();
}

describe("rowan-table", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders text, link, badge, checkbox, and button cells from config", async () => {
    const table = document.createElement("rowan-table");
    table.config = createConfig();

    document.body.append(table);
    await nextMicrotask();

    const bodyRows = table.shadowRoot.querySelectorAll("tbody tr");
    expect(bodyRows.length).to.equal(2);

    expect(table.shadowRoot.querySelectorAll('a[part="link"]').length).to.equal(2);
    expect(table.shadowRoot.querySelectorAll("rowan-badge").length).to.equal(2);
    expect(table.shadowRoot.querySelectorAll("rowan-checkbox").length).to.equal(2);
    expect(table.shadowRoot.querySelectorAll("rowan-button").length).to.equal(2);

    const firstTextCell = bodyRows[0].querySelector('td[data-column-id="name"]');
    expect(firstTextCell.textContent.trim()).to.equal("Ada");
  });

  it("emits rowan-cell-change from checkbox interactions", async () => {
    const table = document.createElement("rowan-table");
    table.config = createConfig();

    document.body.append(table);
    await nextMicrotask();

    let detail = null;
    let eventMeta = null;
    table.addEventListener("rowan-cell-change", (event) => {
      detail = event.detail;
      eventMeta = { bubbles: event.bubbles, composed: event.composed };
    });

    const checkbox = table.shadowRoot.querySelector("rowan-checkbox");
    expect(checkbox).to.not.equal(null);

    await nextMicrotask();

    const input = checkbox.shadowRoot.querySelector('input[type="checkbox"]');
    expect(input).to.not.equal(null);
    input.click();
    await nextMicrotask();

    expect(detail).to.not.equal(null);
    expect(detail.rowId).to.equal("1");
    expect(detail.columnId).to.equal("active");
    expect(typeof detail.value).to.equal("boolean");
    expect(eventMeta).to.deep.equal({ bubbles: true, composed: true });
  });

  it("emits rowan-cell-action from link and button interactions", async () => {
    const table = document.createElement("rowan-table");
    table.config = createConfig();

    document.body.append(table);
    await nextMicrotask();

    const actions = [];
    const eventMeta = [];
    table.addEventListener("rowan-cell-action", (event) => {
      actions.push(event.detail.action);
      eventMeta.push({ bubbles: event.bubbles, composed: event.composed });
    });

    table.shadowRoot.querySelector('a[part="link"]').click();
    await nextMicrotask();

    table.shadowRoot.querySelector("rowan-button").shadowRoot.querySelector("button").click();
    await nextMicrotask();

    expect(actions).to.deep.equal(["link", "button"]);
    expect(eventMeta).to.deep.equal([
      { bubbles: true, composed: true },
      { bubbles: true, composed: true },
    ]);
  });

  it("does not emit table events when parent sets properties", async () => {
    const table = document.createElement("rowan-table");
    table.config = createConfig();

    document.body.append(table);
    await nextMicrotask();

    let fired = false;
    table.addEventListener("rowan-cell-change", () => {
      fired = true;
    });
    table.addEventListener("rowan-cell-action", () => {
      fired = true;
    });

    table.rows = [{ id: "3", name: "Grace", profile: "Open", role: "Editor", active: true }];
    table.columns = createConfig().columns;
    await nextMicrotask();

    expect(fired).to.equal(false);
  });

  it("renders step 5 cell types and custom template cells", async () => {
    const table = document.createElement("rowan-table");

    const template = document.createElement("template");
    template.slot = "price-cell";
    template.innerHTML = '<span class="price-pill"></span>';
    table.append(template);

    table.config = createStepFiveConfig();
    document.body.append(table);
    await nextMicrotask();

    expect(table.shadowRoot.querySelectorAll("[data-cell-type='number']").length).to.equal(2);
    expect(table.shadowRoot.querySelectorAll("[data-cell-type='date']").length).to.equal(2);
    expect(table.shadowRoot.querySelectorAll("[data-cell-type='switch']").length).to.equal(2);
    expect(table.shadowRoot.querySelectorAll("[data-cell-type='icon-button']").length).to.equal(2);
    expect(table.shadowRoot.querySelectorAll("[data-cell-type='avatar']").length).to.equal(2);
    expect(table.shadowRoot.querySelectorAll("[data-cell-type='chip']").length).to.equal(2);
    expect(table.shadowRoot.querySelectorAll("[data-cell-type='progress']").length).to.equal(2);
    expect(table.shadowRoot.querySelectorAll("rowan-switch").length).to.equal(2);
    expect(table.shadowRoot.querySelectorAll("rowan-icon-button").length).to.equal(2);
    expect(table.shadowRoot.querySelectorAll("rowan-avatar").length).to.equal(2);
    expect(table.shadowRoot.querySelectorAll("rowan-chip").length).to.equal(2);
    expect(table.shadowRoot.querySelectorAll("rowan-progress").length).to.equal(2);
    expect(table.shadowRoot.querySelectorAll(".price-pill").length).to.equal(2);
  });

  it("auto-injects a selection column and emits rowan-select", async () => {
    const table = document.createElement("rowan-table");
    table.config = createStepFiveConfig();

    document.body.append(table);
    await nextMicrotask();

    const firstHeader = table.shadowRoot.querySelector("thead th");
    expect(firstHeader.dataset.columnId).to.equal("__select");

    let detail = null;
    let eventMeta = null;
    table.addEventListener("rowan-select", (event) => {
      detail = event.detail;
      eventMeta = { bubbles: event.bubbles, composed: event.composed };
    });

    const selector = table.shadowRoot.querySelector(
      'tbody tr td[data-column-id="__select"] rowan-checkbox',
    );
    expect(selector).to.not.equal(null);
    await nextMicrotask();
    clickCheckboxInput(selector);
    await nextMicrotask();

    expect(detail).to.not.equal(null);
    expect(detail.selected).to.deep.equal(["1"]);
    expect(detail.row.id).to.equal("1");
    expect(detail.selectedRows.length).to.equal(1);
    expect(eventMeta).to.deep.equal({ bubbles: true, composed: true });

    table.selectAll();
    await nextMicrotask();
    expect(table.selectedRows.length).to.equal(2);

    table.clearSelection();
    await nextMicrotask();
    expect(table.selectedRows.length).to.equal(0);
  });

  it("emits rowan-sort and sorts rows from sortable header clicks", async () => {
    const table = document.createElement("rowan-table");
    table.config = createStepFiveConfig();

    document.body.append(table);
    await nextMicrotask();

    const sorts = [];
    const eventMeta = [];
    table.addEventListener("rowan-sort", (event) => {
      sorts.push(event.detail);
      eventMeta.push({ bubbles: event.bubbles, composed: event.composed });
    });

    const nameSortButton = table.shadowRoot.querySelector('th[data-column-id="name"] .sort-button');
    expect(nameSortButton).to.not.equal(null);

    nameSortButton.click();
    await nextMicrotask();

    const firstRowNameAsc = table.shadowRoot
      .querySelector('tbody tr td[data-column-id="name"] a')
      .textContent.trim();

    nameSortButton.click();
    await nextMicrotask();

    const firstRowNameDesc = table.shadowRoot
      .querySelector('tbody tr td[data-column-id="name"] a')
      .textContent.trim();

    expect(sorts).to.deep.equal([
      { id: "name", dir: "asc" },
      { id: "name", dir: "desc" },
    ]);
    expect(eventMeta).to.deep.equal([
      { bubbles: true, composed: true },
      { bubbles: true, composed: true },
    ]);
    expect(firstRowNameAsc).to.equal("Ada");
    expect(firstRowNameDesc).to.equal("Zara");
  });

  it("emits rowan-page-change and pages visible rows", async () => {
    const table = document.createElement("rowan-table");
    table.config = createStepFiveConfig();

    document.body.append(table);
    await nextMicrotask();

    expect(table.shadowRoot.querySelectorAll("tbody tr").length).to.equal(2);

    let detail = null;
    let eventMeta = null;
    table.addEventListener("rowan-page-change", (event) => {
      detail = event.detail;
      eventMeta = { bubbles: event.bubbles, composed: event.composed };
    });

    const nextButton = table.shadowRoot.querySelector('[data-action="next-page"]');
    expect(nextButton).to.not.equal(null);
    nextButton.click();
    await nextMicrotask();

    expect(detail).to.deep.equal({ index: 1, size: 2 });
    expect(eventMeta).to.deep.equal({ bubbles: true, composed: true });

    table.page = { index: 1, size: 2, total: 3 };
    await nextMicrotask();

    expect(table.shadowRoot.querySelectorAll("tbody tr").length).to.equal(1);
  });

  it("emits rowan-row-activate on double-click and Enter", async () => {
    const table = document.createElement("rowan-table");
    table.config = createStepFiveConfig();

    document.body.append(table);
    await nextMicrotask();

    const activations = [];
    const eventMeta = [];
    table.addEventListener("rowan-row-activate", (event) => {
      activations.push(event.detail.rowId);
      eventMeta.push({ bubbles: event.bubbles, composed: event.composed });
    });

    const firstRow = table.shadowRoot.querySelector("tbody tr");
    firstRow.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    firstRow.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    await nextMicrotask();

    expect(activations).to.deep.equal(["1", "1"]);
    expect(eventMeta).to.deep.equal([
      { bubbles: true, composed: true },
      { bubbles: true, composed: true },
    ]);
  });

  it("emits rowan-cell-change for switch cells", async () => {
    const table = document.createElement("rowan-table");
    table.config = createStepFiveConfig();

    document.body.append(table);
    await nextMicrotask();

    let detail = null;
    let eventMeta = null;
    table.addEventListener("rowan-cell-change", (event) => {
      if (event.detail.columnId === "active") detail = event.detail;
      if (event.detail.columnId === "active") {
        eventMeta = { bubbles: event.bubbles, composed: event.composed };
      }
    });

    const switchEl = table.shadowRoot.querySelector('[data-cell-type="switch"]');
    expect(switchEl).to.not.equal(null);
    await nextMicrotask();
    clickCheckboxInput(switchEl);
    await nextMicrotask();

    expect(detail).to.not.equal(null);
    expect(detail.rowId).to.equal("1");
    expect(detail.columnId).to.equal("active");
    expect(eventMeta).to.deep.equal({ bubbles: true, composed: true });
  });

  it("enforces single selection mode to one row", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      ...createStepFiveConfig(),
      selectable: "single",
      page: null,
    };

    document.body.append(table);
    await nextMicrotask();

    const selectors = table.shadowRoot.querySelectorAll(
      'tbody tr td[data-column-id="__select"] rowan-checkbox',
    );
    expect(selectors.length).to.equal(3);

    await nextMicrotask();

    clickCheckboxInput(selectors[0]);
    await nextMicrotask();
    expect(table.selectedRows.map((row) => row.id)).to.deep.equal(["1"]);

    const refreshedSelectors = table.shadowRoot.querySelectorAll(
      'tbody tr td[data-column-id="__select"] rowan-checkbox',
    );
    await nextMicrotask();
    clickCheckboxInput(refreshedSelectors[1]);
    await nextMicrotask();
    expect(table.selectedRows.map((row) => row.id)).to.deep.equal(["2"]);
  });

  it("supports shift range keyboard selection in multiple mode", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      ...createStepFiveConfig(),
      selectable: "multiple",
      page: null,
    };

    document.body.append(table);
    await nextMicrotask();

    const rows = table.shadowRoot.querySelectorAll("tbody tr");
    expect(rows.length).to.equal(3);

    rows[0].dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: " " }));
    await nextMicrotask();
    expect(table.selectedRows.map((row) => row.id)).to.deep.equal(["1"]);

    rows[2].dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, key: " ", shiftKey: true }),
    );
    await nextMicrotask();

    expect(table.selectedRows.map((row) => row.id)).to.deep.equal(["1", "2", "3"]);
  });
});
