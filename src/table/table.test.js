import { expect } from "@esm-bundle/chai";

import "../badge/badge.js";
import "../button/button.js";
import "../checkbox/checkbox.js";
import "./table.js";

const nextMicrotask = () => Promise.resolve();
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

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

  it("treats config as full replacement and flattened properties as partial updates", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      ...createStepFiveConfig(),
      caption: "Initial table",
      density: "lg",
      selected: ["1"],
      sort: { id: "name", dir: "asc" },
    };

    document.body.append(table);
    await nextMicrotask();

    const columns = table.columns;
    const rows = table.rows;
    table.selected = ["2"];
    await nextMicrotask();

    expect(table.columns).to.equal(columns);
    expect(table.rows).to.equal(rows);
    expect(table.selected).to.deep.equal(["2"]);
    expect(table.selectable).to.equal("multiple");

    table.config = {
      columns: [{ id: "name", header: "Name" }],
      rows: [{ id: "4", name: "Grace" }],
    };
    await nextMicrotask();

    expect(table.caption).to.equal("");
    expect(table.density).to.equal("md");
    expect(table.selectable).to.equal("none");
    expect(table.selected).to.deep.equal([]);
    expect(table.sort).to.equal(null);
    expect(table.page).to.equal(null);
    expect(table.rows).to.deep.equal([{ id: "4", name: "Grace" }]);
  });

  it("warns for invalid configuration and keeps valid data usable", async () => {
    const warnings = [];
    const originalWarning = console.warn;
    console.warn = (message) => warnings.push(message);

    try {
      const table = document.createElement("rowan-table");
      table.config = {
        rowId: 42,
        columns: [
          { header: "Missing ID" },
          { id: "name", header: "Name", type: "unsupported" },
          { id: "name", header: "Repeated name" },
        ],
        rows: [
          { id: "1", name: "Ada" },
          { id: "2", name: "Alan" },
        ],
      };

      document.body.append(table);
      await nextMicrotask();

      expect(table.shadowRoot.querySelectorAll("thead th").length).to.equal(1);
      expect(table.shadowRoot.querySelectorAll("tbody tr").length).to.equal(2);
      expect(table.shadowRoot.querySelector('td[data-column-id="name"]').textContent).to.equal(
        "Ada",
      );

      table.config = {
        rowId: "id",
        columns: [{ id: "name", header: "Name" }],
        rows: [
          { id: "same", name: "Ada" },
          { id: "same", name: "Alan" },
        ],
      };
      await nextMicrotask();

      expect(table.shadowRoot.querySelectorAll("tbody tr").length).to.equal(2);
      expect(
        warnings.some((message) => message.includes("missing a non-empty string id")),
      ).to.equal(true);
      expect(warnings.some((message) => message.includes("unsupported cell type"))).to.equal(true);
      expect(warnings.some((message) => message.includes("rowId must be"))).to.equal(true);
      expect(warnings.some((message) => message.includes("share row id"))).to.equal(true);
    } finally {
      console.warn = originalWarning;
    }
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

  it("preserves unchanged row elements when selection changes", async () => {
    const table = document.createElement("rowan-table");
    table.config = createStepFiveConfig();

    document.body.append(table);
    await nextMicrotask();

    const firstRow = table.shadowRoot.querySelector('tbody tr[data-row-id="1"]');
    const secondRow = table.shadowRoot.querySelector('tbody tr[data-row-id="2"]');
    expect(firstRow).to.not.equal(null);
    expect(secondRow).to.not.equal(null);

    table.selected = ["1"];
    await nextMicrotask();

    expect(table.shadowRoot.querySelector('tbody tr[data-row-id="1"]')).to.equal(firstRow);
    expect(table.shadowRoot.querySelector('tbody tr[data-row-id="2"]')).to.equal(secondRow);
    expect(firstRow.querySelector('td[data-column-id="__select"] rowan-checkbox').checked).to.equal(
      true,
    );
    expect(
      secondRow.querySelector('td[data-column-id="__select"] rowan-checkbox').checked,
    ).to.equal(false);
  });

  it("does not rearrange rows for selection-only updates", async () => {
    const table = document.createElement("rowan-table");
    table.config = createStepFiveConfig();

    document.body.append(table);
    await nextMicrotask();

    const body = table.shadowRoot.querySelector("tbody");
    const mutations = [];
    const observer = new MutationObserver((records) => mutations.push(...records));
    observer.observe(body, { childList: true });

    table.selected = ["1"];
    await nextMicrotask();
    await nextMicrotask();
    observer.disconnect();

    expect(mutations).to.deep.equal([]);
  });

  it("preserves custom cell content for unchanged keyed rows", async () => {
    const table = document.createElement("rowan-table");
    const template = document.createElement("template");
    template.slot = "price-cell";
    template.innerHTML = '<span class="price-pill">Price</span>';
    table.append(template);
    table.config = createStepFiveConfig();

    document.body.append(table);
    await nextMicrotask();

    const priceCell = table.shadowRoot.querySelector(
      'tbody tr[data-row-id="1"] td[data-column-id="price"] .price-pill',
    );
    expect(priceCell).to.not.equal(null);

    table.selected = ["1"];
    await nextMicrotask();

    expect(
      table.shadowRoot.querySelector(
        'tbody tr[data-row-id="1"] td[data-column-id="price"] .price-pill',
      ),
    ).to.equal(priceCell);
  });

  it("preserves unchanged row elements across sorting and overlapping page updates", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      ...createStepFiveConfig(),
      page: null,
    };

    document.body.append(table);
    await nextMicrotask();

    const rowOne = table.shadowRoot.querySelector('tbody tr[data-row-id="1"]');
    const rowTwo = table.shadowRoot.querySelector('tbody tr[data-row-id="2"]');
    const rowThree = table.shadowRoot.querySelector('tbody tr[data-row-id="3"]');

    table.sort = { id: "name", dir: "asc" };
    await nextMicrotask();

    expect(table.shadowRoot.querySelector('tbody tr[data-row-id="1"]')).to.equal(rowOne);
    expect(table.shadowRoot.querySelector('tbody tr[data-row-id="2"]')).to.equal(rowTwo);
    expect(table.shadowRoot.querySelector('tbody tr[data-row-id="3"]')).to.equal(rowThree);

    table.page = { index: 0, size: 2, total: 3 };
    await nextMicrotask();

    expect(table.shadowRoot.querySelector('tbody tr[data-row-id="2"]')).to.equal(rowTwo);
    expect(table.shadowRoot.querySelector('tbody tr[data-row-id="3"]')).to.equal(rowThree);
  });

  it("delegates header, row, cell action, and selection interactions", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      ...createStepFiveConfig(),
      page: null,
    };

    document.body.append(table);
    await nextMicrotask();

    const events = {
      sort: 0,
      select: 0,
      action: 0,
      activate: 0,
    };
    table.addEventListener("rowan-sort", () => {
      events.sort += 1;
    });
    table.addEventListener("rowan-select", () => {
      events.select += 1;
    });
    table.addEventListener("rowan-cell-action", () => {
      events.action += 1;
    });
    table.addEventListener("rowan-row-activate", () => {
      events.activate += 1;
    });

    table.shadowRoot.querySelector('th[data-column-id="name"] .sort-button').click();
    await nextMicrotask();

    const adaRow = table.shadowRoot.querySelector('tbody tr[data-row-id="2"]');
    const selector = adaRow.querySelector('td[data-column-id="__select"] rowan-checkbox');
    clickCheckboxInput(selector);
    await nextMicrotask();

    const iconButton = adaRow.querySelector("rowan-icon-button");
    iconButton.shadowRoot.querySelector("button").click();
    adaRow.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await nextMicrotask();

    expect(events).to.deep.equal({
      sort: 1,
      select: 1,
      action: 1,
      activate: 1,
    });
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

    let nameSortButton = table.shadowRoot.querySelector('th[data-column-id="name"] .sort-button');
    expect(nameSortButton).to.not.equal(null);

    nameSortButton.click();
    await nextMicrotask();

    const firstRowNameAsc = table.shadowRoot
      .querySelector('tbody tr td[data-column-id="name"] a')
      .textContent.trim();

    nameSortButton = table.shadowRoot.querySelector('th[data-column-id="name"] .sort-button');
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

  it("keeps row keyboard selection separate from nested control keyboard events", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      ...createStepFiveConfig(),
      page: null,
    };

    document.body.append(table);
    await nextMicrotask();

    const row = table.shadowRoot.querySelector('tbody tr[data-row-id="1"]');
    row.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: " " }));
    await nextMicrotask();

    const selector = row.querySelector('td[data-column-id="__select"] rowan-checkbox');
    selector.shadowRoot
      .querySelector("input")
      .dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true, key: " " }));
    await nextMicrotask();

    expect(table.selectedRows.map((item) => item.id)).to.deep.equal(["1"]);
  });

  it("renders a bounded semantic row window when virtualized", async () => {
    const rows = Array.from({ length: 120 }, (_value, index) => ({
      id: `row-${index}`,
      name: `Row ${index}`,
    }));
    const table = document.createElement("rowan-table");
    table.config = {
      rowId: "id",
      selectable: "multiple",
      virtualized: true,
      virtualItemSize: 20,
      virtualOverscan: 1,
      columns: [{ id: "name", header: "Name" }],
      rows,
    };

    document.body.append(table);
    await nextMicrotask();

    const viewport = table.shadowRoot.querySelector(".table-scroll");
    viewport.style.height = "60px";
    viewport.style.overflow = "auto";
    await nextFrame();
    await nextMicrotask();

    const initialRows = table.shadowRoot.querySelectorAll("tbody tr[data-row-id]");
    expect(initialRows.length).to.be.lessThan(rows.length);
    expect(table.shadowRoot.querySelectorAll("tbody .virtual-spacer").length).to.equal(2);

    viewport.scrollTop = 800;
    viewport.dispatchEvent(new Event("scroll"));
    await nextMicrotask();

    const row = table.shadowRoot.querySelector('tbody tr[data-row-id="row-40"]');
    expect(row).to.not.equal(null);

    row.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: " " }));
    await nextMicrotask();

    expect(table.selected).to.deep.equal(["row-40"]);
  });
});
