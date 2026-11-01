import { expect } from "@esm-bundle/chai";

import { reconnectHost } from "../../test/host-lifecycle.js";
import "../badge/badge.js";
import "../button/button.js";
import "../checkbox/checkbox.js";
import "../filter-builder/filter-builder.js";
import "../table-toolbar/table-toolbar.js";
import "./table.js";
import "./table-editors.js";

const nextMicrotask = () => Promise.resolve();
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

async function waitFor(predicate, frames = 45) {
  for (let frame = 0; frame < frames; frame += 1) {
    if (predicate()) return;
    await nextFrame();
  }
}

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

  it("blocks parser-normalized JavaScript URLs in link cells", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      columns: [
        {
          id: "profile",
          header: "Profile",
          type: "link",
          cell: { href: () => "java\nscript:void(globalThis.__rowanTableLinkProbe = true)" },
        },
      ],
      rows: [{ id: "1", profile: "Open" }],
    };

    document.body.append(table);
    await nextMicrotask();

    const link = table.shadowRoot.querySelector('a[part="link"]');
    expect(link.getAttribute("href")).to.equal("#");
    expect(new URL(link.href).protocol).to.not.equal("javascript:");
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
      if (event.detail.action === "link") event.preventDefault();
      actions.push(event.detail.action);
      eventMeta.push({
        bubbles: event.bubbles,
        composed: event.composed,
        cancelable: event.cancelable,
      });
    });

    table.shadowRoot.querySelector('a[part="link"]').click();
    await nextMicrotask();

    table.shadowRoot.querySelector("rowan-button").shadowRoot.querySelector("button").click();
    await nextMicrotask();

    expect(actions).to.deep.equal(["link", "button"]);
    expect(eventMeta).to.deep.equal([
      { bubbles: true, composed: true, cancelable: true },
      { bubbles: true, composed: true, cancelable: true },
    ]);
  });

  it("lets link cells navigate unless rowan-cell-action is cancelled", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      rowId: "id",
      columns: [
        {
          id: "profile",
          header: "Profile",
          type: "link",
          cell: { href: "#profile" },
        },
      ],
      rows: [{ id: "1", profile: "Open" }],
    };
    document.body.append(table);
    await nextMicrotask();

    const link = table.shadowRoot.querySelector('a[part="link"]');
    expect(link.getAttribute("href")).to.equal("#profile");

    const allowed = new MouseEvent("click", { bubbles: true, cancelable: true, composed: true });
    link.dispatchEvent(allowed);
    expect(allowed.defaultPrevented).to.equal(false);

    table.addEventListener("rowan-cell-action", (event) => {
      event.preventDefault();
    });

    const blocked = new MouseEvent("click", { bubbles: true, cancelable: true, composed: true });
    link.dispatchEvent(blocked);
    expect(blocked.defaultPrevented).to.equal(true);
  });

  it("omits hidden columns from the rendered table", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      rowId: "id",
      columns: [
        { id: "name", header: "Name" },
        { id: "team", header: "Team", hidden: true },
        { id: "score", header: "Score" },
      ],
      rows: [{ id: "1", name: "Ada", team: "Ops", score: 12 }],
    };
    document.body.append(table);
    await nextMicrotask();

    const headers = [...table.shadowRoot.querySelectorAll("thead th")].map(
      (cell) => cell.dataset.columnId,
    );
    expect(headers).to.deep.equal(["name", "score"]);
    expect(table.shadowRoot.querySelector('td[data-column-id="team"]')).to.equal(null);
    expect(table.shadowRoot.querySelector('td[data-column-id="name"]').textContent).to.include(
      "Ada",
    );

    table.columns = table.columns.map((column) =>
      column.id === "team" ? { ...column, hidden: false } : column,
    );
    await nextMicrotask();
    expect(table.shadowRoot.querySelector('th[data-column-id="team"]')).to.not.equal(null);

    table.config = {
      rowId: "id",
      columns: [{ id: "name", header: "Name" }],
      rows: [{ id: "1", name: "Ada" }],
    };
    await nextMicrotask();
    expect(table.columns[0].hidden).to.equal(undefined);
  });

  it("applies column align and verticalAlign to cells", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      rowId: "id",
      columns: [
        { id: "name", header: "Name", align: "end", verticalAlign: "start" },
        { id: "score", header: "Score" },
      ],
      rows: [{ id: "1", name: "Ada", score: 12 }],
    };
    document.body.append(table);
    await nextMicrotask();

    const name = table.shadowRoot.querySelector('td[data-column-id="name"]');
    const score = table.shadowRoot.querySelector('td[data-column-id="score"]');
    expect(name.style.textAlign).to.equal("end");
    expect(name.style.verticalAlign).to.equal("top");
    expect(score.style.textAlign).to.equal("");
    expect(score.style.verticalAlign).to.equal("");
  });

  it("keeps logical alignment and sticky edge effects in RTL", async () => {
    const wrapper = document.createElement("div");
    wrapper.dir = "rtl";
    const table = document.createElement("rowan-table");
    table.style.maxInlineSize = "18rem";
    table.config = {
      rowId: "id",
      columns: [
        { id: "name", header: "Name", align: "start", sticky: "start", minWidth: "8rem" },
        { id: "team", header: "Team", minWidth: "8rem" },
        { id: "status", header: "Status", align: "end", sticky: "end", minWidth: "8rem" },
      ],
      rows: [{ id: "1", name: "Ada", team: "Ops", status: "Watch" }],
    };
    wrapper.append(table);
    document.body.append(wrapper);
    await nextMicrotask();
    await nextFrame();

    const name = table.shadowRoot.querySelector('td[data-column-id="name"]');
    const status = table.shadowRoot.querySelector('td[data-column-id="status"]');
    expect(name.style.textAlign).to.equal("start");
    expect(status.style.textAlign).to.equal("end");
    expect(name.style.insetInlineStart).to.equal("0px");
    expect(status.style.insetInlineEnd).to.equal("0px");
    expect(getComputedStyle(name).boxShadow).to.contain("-8px 0px 8px -8px");
    expect(getComputedStyle(status).boxShadow).to.contain("8px 0px 8px -8px");
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

  it("hides the caption element when there is no caption text or slot", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      columns: [{ id: "name", header: "Name" }],
      rows: [{ id: "1", name: "Ada" }],
    };
    document.body.append(table);
    await nextMicrotask();

    const caption = table.shadowRoot.querySelector("caption");
    expect(caption.hidden).to.equal(true);

    table.caption = "Work orders";
    await nextMicrotask();
    expect(caption.hidden).to.equal(false);
    expect(caption.textContent.trim()).to.equal("Work orders");

    table.caption = "  ";
    await nextMicrotask();
    expect(caption.hidden).to.equal(true);

    const slotted = document.createElement("span");
    slotted.slot = "caption";
    slotted.textContent = "Queued work";
    table.append(slotted);
    await nextMicrotask();
    await nextMicrotask();
    expect(caption.hidden).to.equal(false);

    table.remove();
  });

  it("keeps a caption for assistive technology when caption-visually-hidden is set", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      caption: "Work orders",
      captionVisuallyHidden: true,
      columns: [{ id: "name", header: "Name" }],
      rows: [{ id: "1", name: "Ada" }],
    };
    document.body.append(table);
    await nextMicrotask();

    const caption = table.shadowRoot.querySelector("caption");
    expect(caption.hidden).to.equal(false);
    expect(caption.classList.contains("visually-hidden")).to.equal(true);
    expect(caption.textContent.trim()).to.equal("Work orders");
    expect(getComputedStyle(caption).position).to.equal("absolute");

    table.remove();
  });

  it("shares one chrome when a toolbar is slotted", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      caption: "Work orders",
      captionVisuallyHidden: true,
      columns: [{ id: "name", header: "Name" }],
      rows: [{ id: "1", name: "Ada" }],
    };
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    const title = document.createElement("span");
    title.slot = "start";
    title.textContent = "Open orders";
    toolbar.append(title);
    table.append(toolbar);
    document.body.append(table);
    await nextMicrotask();
    await waitForStyles(table);
    await waitForStyles(toolbar);

    const wrapper = table.shadowRoot.querySelector(".wrapper");
    const chrome = table.shadowRoot.querySelector(".chrome");
    const tableEl = table.shadowRoot.querySelector("table");
    const toolbarSurface = toolbar.shadowRoot.querySelector(".toolbar");
    const caption = table.shadowRoot.querySelector("caption");

    expect(wrapper.hasAttribute("data-has-toolbar")).to.equal(true);
    expect(getComputedStyle(chrome).rowGap).to.equal("0px");
    expect(getComputedStyle(chrome).borderStartStartRadius).to.not.equal("0px");
    expect(getComputedStyle(tableEl).borderBlockStartWidth).to.equal("0px");
    expect(getComputedStyle(tableEl).borderStartStartRadius).to.equal("0px");
    expect(getComputedStyle(toolbarSurface).borderWidth).to.equal("0px");
    expect(caption.classList.contains("visually-hidden")).to.equal(true);

    table.remove();
  });

  it("drops the tinted header band when a toolbar is present", async () => {
    const paint = (table) => {
      table.style.setProperty("--rowan-color-fg", "rgb(0, 0, 0)");
      table.style.setProperty("--rowan-color-bg", "rgb(255, 255, 255)");
    };
    const config = {
      columns: [{ id: "name", header: "Name" }],
      rows: [{ id: "1", name: "Ada" }],
    };

    const standalone = document.createElement("rowan-table");
    standalone.config = config;
    paint(standalone);

    const withToolbar = document.createElement("rowan-table");
    withToolbar.config = config;
    const toolbar = document.createElement("rowan-table-toolbar");
    toolbar.slot = "toolbar";
    withToolbar.append(toolbar);
    paint(withToolbar);

    document.body.append(standalone, withToolbar);
    await nextMicrotask();
    await waitForStyles(standalone);
    await waitForStyles(withToolbar);

    const standaloneHead = getComputedStyle(standalone.shadowRoot.querySelector(".thead"));
    const toolbarHead = getComputedStyle(withToolbar.shadowRoot.querySelector(".thead"));
    const standaloneLabel = getComputedStyle(standalone.shadowRoot.querySelector(".th"));
    const toolbarLabel = getComputedStyle(withToolbar.shadowRoot.querySelector(".th"));

    expect(toolbarHead.backgroundColor).to.equal("rgb(255, 255, 255)");
    expect(standaloneHead.backgroundColor).to.not.equal(toolbarHead.backgroundColor);
    expect(toolbarLabel.color).to.equal(standaloneLabel.color);
    expect(toolbarLabel.fontWeight).to.equal(standaloneLabel.fontWeight);

    standalone.remove();
    withToolbar.remove();
  });

  it("keeps a standalone table card when the toolbar slot is empty", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      caption: "Work orders",
      columns: [{ id: "name", header: "Name" }],
      rows: [{ id: "1", name: "Ada" }],
    };
    document.body.append(table);
    await nextMicrotask();
    await waitForStyles(table);

    const wrapper = table.shadowRoot.querySelector(".wrapper");
    const tableEl = table.shadowRoot.querySelector("table");

    expect(wrapper.hasAttribute("data-has-toolbar")).to.equal(false);
    expect(getComputedStyle(tableEl).borderBlockStartWidth).to.not.equal("0px");
    expect(getComputedStyle(tableEl).borderStartStartRadius).to.not.equal("0px");

    table.remove();
  });

  it("drops filter-builder card chrome in the toolbar slot", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      columns: [{ id: "name", header: "Name" }],
      rows: [{ id: "1", name: "Ada" }],
    };
    const builder = document.createElement("rowan-filter-builder");
    builder.slot = "toolbar";
    table.append(builder);
    document.body.append(table);
    await nextMicrotask();
    await waitForStyles(table);
    await waitForStyles(builder);

    expect(table.shadowRoot.querySelector(".wrapper").hasAttribute("data-has-toolbar")).to.equal(
      true,
    );
    expect(getComputedStyle(builder).borderWidth).to.equal("0px");

    table.remove();
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

  it("normalizes unsupported density and selectable to documented defaults", async () => {
    const table = document.createElement("rowan-table");
    table.density = "xl";
    table.selectable = "all";
    document.body.append(table);
    await nextMicrotask();

    expect(table.density).to.equal("md");
    expect(table.selectable).to.equal("none");
    expect(table.hasAttribute("density")).to.equal(false);
    expect(table.hasAttribute("selectable")).to.equal(false);

    table.setAttribute("density", " SM ");
    table.setAttribute("selectable", " MULTIPLE ");
    expect(table.density).to.equal("sm");
    expect(table.selectable).to.equal("multiple");
    expect(table.getAttribute("density")).to.equal("sm");
    expect(table.getAttribute("selectable")).to.equal("multiple");
  });

  it("clears configuration with null and undefined", async () => {
    const table = document.createElement("rowan-table");
    table.config = createStepFiveConfig();

    document.body.append(table);
    await nextMicrotask();

    table.config = null;
    await nextMicrotask();

    expect(table.columns).to.deep.equal([]);
    expect(table.rows).to.deep.equal([]);
    expect(table.selected).to.deep.equal([]);
    expect(table.sort).to.equal(null);
    expect(table.page).to.equal(null);

    table.config = createConfig();
    table.config = undefined;
    await nextMicrotask();

    expect(table.columns).to.deep.equal([]);
    expect(table.rows).to.deep.equal([]);
    expect(table.selected).to.deep.equal([]);
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

  it("renders sparkline cells from a number array and optional tone", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      rowId: "id",
      columns: [
        { id: "name", header: "Name" },
        { id: "trend", header: "Trend", type: "sparkline", cell: { tone: "success" } },
      ],
      rows: [{ id: "1", name: "Wells", trend: [4, 8, 3, 9] }],
    };
    document.body.append(table);
    await nextMicrotask();

    const chart = table.shadowRoot.querySelector("rowan-sparkline");
    expect(chart).to.not.equal(null);
    expect(chart.values).to.deep.equal([4, 8, 3, 9]);
    expect(chart.tone).to.equal("success");
    expect(table.shadowRoot.querySelector("[data-cell-type='sparkline']")).to.equal(chart);

    table.remove();
  });

  it("renders bullet cells from a payload or column ranges", async () => {
    const table = document.createElement("rowan-table");
    const ranges = [
      { from: 0, to: 50, label: "Low", tone: "danger" },
      { from: 50, to: 80, label: "Fair", tone: "warning" },
      { from: 80, to: 100, label: "Good", tone: "success" },
    ];
    table.config = {
      rowId: "id",
      columns: [
        { id: "name", header: "Yard" },
        { id: "fill", header: "Fill", type: "bullet" },
        {
          id: "score",
          header: "Score",
          type: "bullet",
          cell: { ranges },
        },
      ],
      rows: [
        {
          id: "north",
          name: "North",
          fill: { value: 82, target: 90, ranges },
          score: { value: 74, target: 90 },
        },
      ],
    };
    document.body.append(table);
    await nextMicrotask();

    const charts = [...table.shadowRoot.querySelectorAll("rowan-bullet-chart")];
    expect(charts).to.have.length(2);
    expect(charts[0].value).to.equal(82);
    expect(charts[0].target).to.equal(90);
    expect(charts[0].ranges).to.have.length(3);
    expect(charts[0].label).to.equal("Fill");
    expect(charts[1].value).to.equal(74);
    expect(charts[1].target).to.equal(90);
    expect(charts[1].ranges.map((range) => range.label)).to.deep.equal(["Low", "Fair", "Good"]);
    expect(table.shadowRoot.querySelector("[data-cell-type='bullet']")).to.equal(charts[0]);

    table.remove();
  });

  it("keeps bullet cells in the virtualized row window", async () => {
    const rows = Array.from({ length: 40 }, (_, index) => ({
      id: String(index + 1),
      name: `Yard ${index + 1}`,
      fill: { value: 60 + (index % 20), target: 90 },
    }));
    const table = document.createElement("rowan-table");
    table.style.setProperty("--rowan-table-virtual-height", "80px");
    table.config = {
      rowId: "id",
      virtualized: true,
      virtualItemSize: 20,
      virtualOverscan: 1,
      columns: [
        { id: "name", header: "Yard" },
        { id: "fill", header: "Fill", type: "bullet" },
      ],
      rows,
    };
    document.body.append(table);
    await nextMicrotask();
    await nextFrame();
    await nextMicrotask();

    const mounted = table.shadowRoot.querySelector("tbody tr[data-row-id]");
    expect(mounted).to.not.equal(null);
    expect(table.shadowRoot.querySelectorAll("tbody tr[data-row-id]").length).to.be.below(
      rows.length,
    );
    expect(mounted.querySelector("rowan-bullet-chart")).to.not.equal(null);
    expect(mounted.querySelector("rowan-bullet-chart").target).to.equal(90);

    table.remove();
  });

  it("renders custom cell callbacks with the documented context", async () => {
    const table = document.createElement("rowan-table");
    const contexts = [];
    table.config = {
      rowId: "id",
      columns: [
        {
          id: "name",
          header: "Name",
          type: "custom",
          cell: {
            render: (context) => {
              contexts.push(context);
              const value = document.createElement("strong");
              value.className = "custom-name";
              value.textContent = `${context.rowIndex}: ${context.value}`;
              return value;
            },
          },
        },
        {
          id: "status",
          header: "Status",
          type: "custom",
          cell: { render: ({ value }) => `Current: ${value}` },
        },
      ],
      rows: [{ id: "member-1", name: "Ada", status: "Active" }],
    };

    document.body.append(table);
    await nextMicrotask();

    const nameCell = table.shadowRoot.querySelector('td[data-column-id="name"]');
    const statusCell = table.shadowRoot.querySelector('td[data-column-id="status"]');
    expect(contexts).to.have.length(1);
    expect(contexts[0]).to.include({
      value: "Ada",
      row: table.rows[0],
      rowIndex: 0,
      column: table.columns[0],
      cellEl: nameCell,
    });
    expect(nameCell.querySelector(".custom-name").textContent).to.equal("0: Ada");
    expect(statusCell.textContent.trim()).to.equal("Current: Active");
  });

  it("renders documented header and cell configuration metadata", async () => {
    const table = document.createElement("rowan-table");
    const template = document.createElement("template");
    template.slot = "custom-status";
    template.innerHTML = '<button class="hydrate">Hydrate</button>';
    table.append(template);

    const bindings = [];
    table.addEventListener("rowan-cell-bind", (event) => bindings.push(event.detail));
    table.config = {
      rowId: "id",
      selectable: "multiple",
      columns: [
        {
          id: "approval",
          header: "Approval",
          type: "checkbox",
          headerCell: { tooltip: "Current approval status" },
          cell: { indeterminate: true, title: (value) => `Approval: ${value}` },
        },
        {
          id: "status",
          header: "Status",
          type: "custom",
          cell: { slot: "custom-status", title: "Hydrate this status" },
        },
      ],
      rows: [{ id: "order-1", approval: true, status: "Pending" }],
    };

    document.body.append(table);
    await nextMicrotask();

    const approvalHeader = table.shadowRoot.querySelector('th[data-column-id="approval"]');
    const approvalCell = table.shadowRoot.querySelector('td[data-column-id="approval"]');
    const checkbox = approvalCell.querySelector("rowan-checkbox");
    const statusCell = table.shadowRoot.querySelector('td[data-column-id="status"]');

    expect(approvalHeader.title).to.equal("Current approval status");
    expect(approvalHeader.getAttribute("aria-description")).to.equal("Current approval status");
    expect(approvalCell.title).to.equal("Approval: true");
    expect(checkbox.indeterminate).to.equal(true);
    expect(statusCell.title).to.equal("Hydrate this status");
    expect(statusCell.dataset.rowId).to.equal("order-1");
    expect(statusCell.querySelector(".hydrate").dataset.rowId).to.equal("order-1");
    expect(bindings).to.have.length(1);
    expect(bindings[0]).to.include({
      rowId: "order-1",
      columnId: "status",
      rowIndex: 0,
      value: "Pending",
      cellEl: statusCell,
    });

    table.selected = ["order-1"];
    await nextMicrotask();
    expect(bindings).to.have.length(1);
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

  it("keeps sort and page listeners after reconnecting", async () => {
    const table = document.createElement("rowan-table");
    table.config = createStepFiveConfig();
    document.body.append(table);
    await nextMicrotask();

    const sorts = [];
    const pages = [];
    table.addEventListener("rowan-sort", (event) => sorts.push(event.detail));
    table.addEventListener("rowan-page-change", (event) => pages.push(event.detail));

    await reconnectHost(table);

    table.shadowRoot.querySelector('th[data-column-id="name"] .sort-button').click();
    await nextMicrotask();
    table.shadowRoot.querySelector('[data-action="next-page"]').click();
    await nextMicrotask();

    expect(sorts).to.deep.equal([{ id: "name", dir: "asc" }]);
    expect(pages).to.deep.equal([{ index: 1, page: 2, size: 2 }]);
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

    expect(detail).to.deep.equal({ index: 1, page: 2, size: 2 });
    expect(eventMeta).to.deep.equal({ bubbles: true, composed: true });

    table.page = { index: 1, size: 2, total: 3 };
    await nextMicrotask();

    expect(table.shadowRoot.querySelectorAll("tbody tr").length).to.equal(1);
  });

  it("normalizes out-of-range page state and retains selection across pages", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      ...createStepFiveConfig(),
      page: { index: 99, size: 2, total: 3 },
    };

    document.body.append(table);
    await nextMicrotask();

    expect(table.page).to.deep.equal({ index: 1, size: 2, total: 3 });
    expect(table.shadowRoot.querySelectorAll("tbody tr[data-row-id]").length).to.equal(1);
    expect(table.shadowRoot.querySelector('tbody tr[data-row-id="3"]')).to.not.equal(null);

    const selector = table.shadowRoot.querySelector(
      'tbody tr[data-row-id="3"] td[data-column-id="__select"] rowan-checkbox',
    );
    selector.checked = true;
    selector.dispatchEvent(new CustomEvent("rowan-change", { bubbles: true, composed: true }));
    await nextMicrotask();

    expect(table.selected).to.deep.equal(["3"]);

    table.page = { index: 0, size: 2, total: 3 };
    await nextMicrotask();

    expect(table.selected).to.deep.equal(["3"]);
    expect(table.selectedRows.map((row) => row.id)).to.deep.equal(["3"]);
    expect(table.shadowRoot.querySelectorAll("tbody tr[data-row-id]").length).to.equal(2);
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

  it("does not activate the row from interactive cell controls", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      ...createStepFiveConfig(),
      page: null,
    };
    document.body.append(table);
    await nextMicrotask();

    const activations = [];
    table.addEventListener("rowan-row-activate", (event) => activations.push(event.detail.rowId));

    const row = table.shadowRoot.querySelector("tbody tr");
    const dblclick = () => new MouseEvent("dblclick", { bubbles: true, composed: true });
    row.querySelector("rowan-icon-button").dispatchEvent(dblclick());
    row.querySelector('td[data-column-id="name"]').dispatchEvent(dblclick());
    await nextMicrotask();

    expect(activations).to.deep.equal([]);

    row.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await nextMicrotask();
    expect(activations).to.deep.equal(["1"]);
  });

  it("treats cell.interactive as a whole-cell hit target and can disable row activation", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      rowId: "id",
      columns: [
        { id: "name", header: "Name" },
        {
          id: "note",
          header: "Note",
          type: "custom",
          cell: {
            interactive: true,
            render: () => {
              const span = document.createElement("span");
              span.className = "note";
              span.textContent = "Open";
              return span;
            },
          },
        },
      ],
      rows: [{ id: "1", name: "Ada", note: "Open" }],
    };
    document.body.append(table);
    await nextMicrotask();

    const activations = [];
    table.addEventListener("rowan-row-activate", (event) => activations.push(event.detail.rowId));

    table.shadowRoot
      .querySelector(".note")
      .dispatchEvent(new MouseEvent("dblclick", { bubbles: true, composed: true }));
    await nextMicrotask();
    expect(activations).to.deep.equal([]);

    table.rowActivate = "none";
    table.shadowRoot
      .querySelector("tbody tr")
      .dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    table.shadowRoot
      .querySelector("tbody tr")
      .dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    await nextMicrotask();
    expect(activations).to.deep.equal([]);

    table.config = {
      rowId: "id",
      columns: [{ id: "name", header: "Name" }],
      rows: [{ id: "1", name: "Ada" }],
    };
    expect(table.rowActivate).to.equal("dblclick");
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

  it("anchors a shift range to the selected row after sorting reorders it", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      ...createStepFiveConfig(),
      selectable: "multiple",
      page: null,
    };

    document.body.append(table);
    await nextMicrotask();

    const idsInOrder = () =>
      [...table.shadowRoot.querySelectorAll("tbody tr")].map((row) => row.dataset.rowId);

    expect(idsInOrder()).to.deep.equal(["1", "2", "3"]);

    table.shadowRoot
      .querySelectorAll("tbody tr")[0]
      .dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: " " }));
    await nextMicrotask();
    expect(table.selectedRows.map((row) => row.id)).to.deep.equal(["1"]);

    // Sorting moves the anchor row "1" from first to last, so the range must follow
    // the row rather than the slot it used to occupy.
    table.sortBy("name", "asc");
    await nextMicrotask();
    await nextMicrotask();
    expect(idsInOrder()).to.deep.equal(["2", "3", "1"]);

    table.shadowRoot
      .querySelectorAll("tbody tr")[0]
      .dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: " ", shiftKey: true }));
    await nextMicrotask();

    expect(table.selectedRows.map((row) => row.id)).to.deep.equal(["1", "2", "3"]);
  });

  it("keeps the scroll position when row data is updated in place", async () => {
    const rows = Array.from({ length: 60 }, (_, index) => ({
      id: String(index + 1),
      name: `Person ${index + 1}`,
    }));

    const table = document.createElement("rowan-table");
    table.style.setProperty("--rowan-table-virtual-height", "100px");
    table.config = {
      rowId: "id",
      columns: [{ id: "name", header: "Name" }],
      rows,
      virtualized: true,
      virtualItemSize: 20,
    };

    document.body.append(table);
    await nextMicrotask();
    await nextMicrotask();

    const viewport = table.shadowRoot.querySelector(".table-scroll");
    viewport.scrollTop = 300;
    viewport.dispatchEvent(new Event("scroll"));
    await nextMicrotask();
    await nextMicrotask();

    const scrollBefore = viewport.scrollTop;
    expect(scrollBefore).to.be.above(0);

    table.rows = rows.map((row) => ({ ...row, name: `${row.name} (updated)` }));
    await nextMicrotask();
    await nextMicrotask();

    expect(viewport.scrollTop).to.equal(scrollBefore);

    const renderedRows = table.shadowRoot.querySelectorAll("tbody tr[data-row-id]");
    expect(renderedRows.length).to.be.above(0);
    // Proves the body actually re-rendered, so the preserved scroll position means something.
    expect(renderedRows[0].textContent).to.contain("(updated)");

    table.remove();
  });

  it("still renders rows when the dataset shrinks below the scroll offset", async () => {
    const rows = Array.from({ length: 60 }, (_, index) => ({
      id: String(index + 1),
      name: `Person ${index + 1}`,
    }));

    const table = document.createElement("rowan-table");
    table.style.setProperty("--rowan-table-virtual-height", "100px");
    table.config = {
      rowId: "id",
      columns: [{ id: "name", header: "Name" }],
      rows,
      virtualized: true,
      virtualItemSize: 20,
    };

    document.body.append(table);
    await nextMicrotask();
    await nextMicrotask();

    const viewport = table.shadowRoot.querySelector(".table-scroll");
    viewport.scrollTop = 900;
    viewport.dispatchEvent(new Event("scroll"));
    await nextMicrotask();
    await nextMicrotask();

    // Filtering down to fewer rows than the old scroll offset must not blank the viewport.
    table.rows = rows.slice(0, 3);
    await nextMicrotask();
    await nextMicrotask();

    const rendered = table.shadowRoot.querySelectorAll("tbody tr[data-row-id]");
    expect(rendered.length).to.equal(3);

    table.remove();
  });

  it("holds the visible row steady when rows are inserted above the viewport", async () => {
    const rows = Array.from({ length: 60 }, (_, index) => ({
      id: String(index + 1),
      name: `Person ${index + 1}`,
    }));

    const table = document.createElement("rowan-table");
    table.style.setProperty("--rowan-table-virtual-height", "100px");
    table.config = {
      rowId: "id",
      columns: [{ id: "name", header: "Name" }],
      rows,
      virtualized: true,
      virtualItemSize: 20,
      virtualOverscan: 0,
    };

    document.body.append(table);
    await nextMicrotask();
    await nextMicrotask();

    const viewport = table.shadowRoot.querySelector(".table-scroll");
    viewport.scrollTop = 400;
    viewport.dispatchEvent(new Event("scroll"));
    await nextMicrotask();
    await nextMicrotask();

    const topRowBefore = table.shadowRoot.querySelector("tbody tr[data-row-id]").dataset.rowId;
    const scrollBefore = viewport.scrollTop;

    // Prepending shifts every offset below it; the anchored row must stay in view.
    table.rows = [
      { id: "new-1", name: "Inserted 1" },
      { id: "new-2", name: "Inserted 2" },
      ...rows,
    ];
    await nextMicrotask();
    await nextMicrotask();

    const topRowAfter = table.shadowRoot.querySelector("tbody tr[data-row-id]").dataset.rowId;
    expect(topRowAfter).to.equal(topRowBefore);
    expect(viewport.scrollTop).to.be.above(scrollBefore);

    table.remove();
  });

  it("exposes the full row count when rows are omitted from the DOM", async () => {
    const rows = Array.from({ length: 40 }, (_, index) => ({
      id: String(index + 1),
      name: `Person ${index + 1}`,
    }));

    const table = document.createElement("rowan-table");
    table.style.setProperty("--rowan-table-virtual-height", "80px");
    table.config = {
      rowId: "id",
      columns: [{ id: "name", header: "Name" }],
      rows,
      virtualized: true,
      virtualItemSize: 20,
      virtualOverscan: 1,
    };

    document.body.append(table);
    await nextMicrotask();
    await nextMicrotask();

    const domRows = table.shadowRoot.querySelectorAll("tbody tr:not(.virtual-spacer)");
    expect(domRows.length).to.be.below(rows.length);

    const tableElement = table.shadowRoot.querySelector("table");
    // aria-rowcount counts the header row too, so 40 data rows means 41.
    expect(tableElement.getAttribute("aria-rowcount")).to.equal("41");

    const firstRendered = domRows[0];
    expect(firstRendered.getAttribute("aria-rowindex")).to.equal("2");

    table.remove();
  });

  it("does not paint pagination when page is unset", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      columns: [{ id: "name", header: "Name" }],
      rows: [{ id: "1", name: "Ada" }],
    };
    document.body.append(table);
    await nextMicrotask();

    const pagination = table.shadowRoot.querySelector(".pagination");
    expect(pagination.hidden).to.equal(true);
    expect(getComputedStyle(pagination).display).to.equal("none");

    table.remove();
  });

  it("numbers paginated rows against the full row set", async () => {
    const table = document.createElement("rowan-table");
    table.config = { ...createStepFiveConfig(), page: { index: 1, size: 2 } };

    document.body.append(table);
    await nextMicrotask();

    const tableElement = table.shadowRoot.querySelector("table");
    expect(tableElement.getAttribute("aria-rowcount")).to.equal("4");

    const rows = table.shadowRoot.querySelectorAll("tbody tr[data-row-id]");
    expect(rows.length).to.equal(1);
    // Third data row overall, and aria-rowindex counts the header, so 4.
    expect(rows[0].getAttribute("aria-rowindex")).to.equal("4");

    table.remove();
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

  it("reconciles overlapping virtual windows by collection key", async () => {
    const rows = Array.from({ length: 120 }, (_value, index) => ({
      id: `row-${index}`,
      name: `Row ${index}`,
    }));
    const table = document.createElement("rowan-table");
    table.config = {
      rowId: "id",
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

    viewport.scrollTop = 800;
    viewport.dispatchEvent(new Event("scroll"));
    await nextMicrotask();

    const rowForty = table.shadowRoot.querySelector('tbody tr[data-row-id="row-40"]');
    expect(rowForty).to.not.equal(null);
    expect(rowForty.dataset.virtualKey).to.equal("row-40");

    viewport.scrollTop = 820;
    viewport.dispatchEvent(new Event("scroll"));
    await nextMicrotask();

    expect(table.shadowRoot.querySelector('tbody tr[data-row-id="row-40"]')).to.equal(rowForty);

    const mountedRows = [...table.shadowRoot.querySelectorAll("tbody tr[data-row-id]")];
    expect(mountedRows.length).to.be.lessThan(10);
    expect(new Set(mountedRows.map((row) => row.dataset.rowId)).size).to.equal(mountedRows.length);

    viewport.scrollTop = 0;
    viewport.dispatchEvent(new Event("scroll"));
    await nextMicrotask();

    expect(table.shadowRoot.querySelectorAll("tbody tr[data-row-id]").length).to.be.lessThan(10);
  });

  it("keeps large virtualized tables bounded and stable across repeated renders", async () => {
    for (const rowCount of [100, 1000, 5000]) {
      const rows = Array.from({ length: rowCount }, (_value, index) => ({
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

      viewport.scrollTop = 800;
      viewport.dispatchEvent(new Event("scroll"));
      await nextMicrotask();

      const initialMountedRows = [...table.shadowRoot.querySelectorAll("tbody tr[data-row-id]")];
      const targetRow = initialMountedRows.at(-1);
      expect(targetRow, `${rowCount} rows should render a scrolled record`).to.not.equal(null);
      const targetRowId = targetRow.dataset.rowId;

      table.selected = [targetRowId];
      await nextMicrotask();
      expect(table.shadowRoot.querySelector(`tbody tr[data-row-id="${targetRowId}"]`)).to.equal(
        targetRow,
      );

      viewport.scrollTop = 810;
      viewport.dispatchEvent(new Event("scroll"));
      await nextMicrotask();

      const mountedRows = [...table.shadowRoot.querySelectorAll("tbody tr[data-row-id]")];
      expect(mountedRows.length, `${rowCount} rows should retain a bounded window`).to.be.lessThan(
        10,
      );
      expect(
        new Set(mountedRows.map((row) => row.dataset.rowId)).size,
        `${rowCount} rows should not mount duplicate public row IDs`,
      ).to.equal(mountedRows.length);
      expect(table.shadowRoot.querySelector(`tbody tr[data-row-id="${targetRowId}"]`)).to.equal(
        targetRow,
      );

      table.remove();
    }
  });

  it("falls back to a full body render when virtualized rows share ids", async () => {
    const rows = Array.from({ length: 20 }, (_, index) => ({
      id: index < 10 ? "dup" : String(index),
      name: `Row ${index}`,
    }));
    const table = document.createElement("rowan-table");
    table.style.setProperty("--rowan-table-virtual-height", "80px");
    table.config = {
      rowId: "id",
      virtualized: true,
      virtualItemSize: 20,
      virtualOverscan: 1,
      columns: [{ id: "name", header: "Name" }],
      rows,
    };

    document.body.append(table);
    await nextMicrotask();
    await nextFrame();
    await nextMicrotask();

    expect(table.shadowRoot.querySelectorAll("tbody .virtual-spacer").length).to.equal(0);
    expect(table.shadowRoot.querySelectorAll("tbody tr[data-row-id]").length).to.equal(rows.length);

    table.remove();
  });

  it("emits cell events from mounted virtualized rows", async () => {
    const rows = Array.from({ length: 40 }, (_, index) => ({
      id: String(index + 1),
      name: `Person ${index + 1}`,
      edit: "Edit",
    }));
    const table = document.createElement("rowan-table");
    table.style.setProperty("--rowan-table-virtual-height", "80px");
    table.config = {
      rowId: "id",
      virtualized: true,
      virtualItemSize: 20,
      virtualOverscan: 1,
      columns: [
        { id: "name", header: "Name" },
        {
          id: "edit",
          header: "",
          type: "button",
          cell: { label: "Edit", variant: "secondary" },
        },
      ],
      rows,
    };

    document.body.append(table);
    await nextMicrotask();
    await nextFrame();
    await nextMicrotask();

    const mounted = table.shadowRoot.querySelector("tbody tr[data-row-id]");
    expect(mounted).to.not.equal(null);
    expect(table.shadowRoot.querySelectorAll("tbody tr[data-row-id]").length).to.be.below(
      rows.length,
    );

    const actions = [];
    table.addEventListener("rowan-cell-action", (event) => {
      actions.push(event.detail);
    });

    mounted.querySelector("rowan-button").shadowRoot.querySelector("button").click();
    await nextMicrotask();

    expect(actions).to.have.lengthOf(1);
    expect(actions[0].action).to.equal("button");
    expect(actions[0].rowId).to.equal(mounted.dataset.rowId);
    expect(actions[0].columnId).to.equal("edit");

    table.remove();
  });

  it("pins leading and trailing columns while preserving DOM order", async () => {
    const table = document.createElement("rowan-table");
    table.style.maxInlineSize = "18rem";
    table.config = {
      rowId: "id",
      selectable: "multiple",
      stickyHeader: true,
      columns: [
        { id: "name", header: "Name", sticky: "start", minWidth: "8rem" },
        { id: "team", header: "Team", minWidth: "8rem" },
        { id: "site", header: "Site", minWidth: "8rem" },
        { id: "status", header: "Status", sticky: "end", minWidth: "6rem" },
      ],
      rows: [{ id: "1", name: "Ada", team: "Ops", site: "East", status: "Watch" }],
    };
    document.body.append(table);
    await nextMicrotask();
    await nextFrame();

    const headerIds = [...table.shadowRoot.querySelectorAll("thead th")].map(
      (cell) => cell.dataset.columnId,
    );
    expect(headerIds).to.deep.equal(["__select", "name", "team", "site", "status"]);

    const select = table.shadowRoot.querySelector('th[data-column-id="__select"]');
    const name = table.shadowRoot.querySelector('th[data-column-id="name"]');
    const team = table.shadowRoot.querySelector('th[data-column-id="team"]');
    const status = table.shadowRoot.querySelector('th[data-column-id="status"]');
    expect(select.classList.contains("sticky-start")).to.equal(true);
    expect(name.classList.contains("sticky-start")).to.equal(true);
    expect(team.classList.contains("sticky-start")).to.equal(false);
    expect(status.classList.contains("sticky-end")).to.equal(true);
    expect(name.classList.contains("is-edge-start")).to.equal(true);
    expect(status.classList.contains("is-edge-end")).to.equal(true);

    const nameInset = Number.parseFloat(name.style.insetInlineStart || "0");
    expect(nameInset).to.be.greaterThan(0);
    expect(status.style.insetInlineEnd).to.equal("0px");

    const bodyName = table.shadowRoot.querySelector('td[data-column-id="name"]');
    expect(bodyName.classList.contains("sticky-start")).to.equal(true);
    expect(bodyName.style.insetInlineStart).to.equal(name.style.insetInlineStart);
  });

  it("keeps sticky classes on a virtualized body", async () => {
    const rows = Array.from({ length: 40 }, (_value, index) => ({
      id: `row-${index}`,
      name: `Row ${index}`,
      status: "Watch",
    }));
    const table = document.createElement("rowan-table");
    table.config = {
      rowId: "id",
      virtualized: true,
      virtualItemSize: 24,
      virtualOverscan: 1,
      columns: [
        { id: "name", header: "Name", sticky: "start" },
        { id: "status", header: "Status", sticky: "end" },
      ],
      rows,
    };
    document.body.append(table);
    await nextMicrotask();
    const viewport = table.shadowRoot.querySelector(".table-scroll");
    viewport.style.height = "80px";
    await nextFrame();
    await nextMicrotask();

    expect(
      table.shadowRoot
        .querySelector("th[data-column-id='name']")
        .classList.contains("sticky-start"),
    ).to.equal(true);
    expect(
      table.shadowRoot
        .querySelector("td[data-column-id='name']")
        .classList.contains("sticky-start"),
    ).to.equal(true);
    expect(
      table.shadowRoot
        .querySelector("td[data-column-id='status']")
        .classList.contains("sticky-end"),
    ).to.equal(true);
  });

  it("groups rows, toggles collapse, and emits rowan-group-toggle", async () => {
    const table = document.createElement("rowan-table");
    const toggles = [];
    table.addEventListener("rowan-group-toggle", (event) => {
      toggles.push(event.detail);
    });
    table.config = {
      rowId: "id",
      groupBy: "team",
      columns: [
        { id: "name", header: "Name" },
        { id: "team", header: "Team" },
        { id: "score", header: "Score", type: "number" },
      ],
      rows: [
        { id: "1", name: "Ada", team: "Ops", score: 10 },
        { id: "2", name: "Alan", team: "Ops", score: 4 },
        { id: "3", name: "Grace", team: "Platform", score: 8 },
      ],
    };
    document.body.append(table);
    await nextMicrotask();

    const headers = [...table.shadowRoot.querySelectorAll("tr.group-row .group-toggle")].map(
      (button) => button.textContent,
    );
    expect(headers).to.deep.equal(["Ops (2)", "Platform (1)"]);
    expect(
      table.shadowRoot.querySelectorAll("tr[data-row-id='1'], tr[data-row-id='2']"),
    ).to.have.lengthOf(2);

    table.shadowRoot.querySelector('[data-group-key="rowan:value:Ops"] .group-toggle').click();
    await nextMicrotask();

    expect(
      table.shadowRoot
        .querySelector('[data-group-key="rowan:value:Ops"] .group-toggle')
        .getAttribute("aria-expanded"),
    ).to.equal("false");
    expect(table.shadowRoot.querySelector("tr[data-row-id='1']")).to.equal(null);
    expect(table.shadowRoot.querySelector("tr[data-row-id='3']")).to.not.equal(null);
    expect(toggles).to.deep.equal([{ groupKey: "Ops", expanded: false }]);
  });

  it("renders number subtotals for expanded groups", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      rowId: "id",
      groupBy: { id: "team", subtotals: true },
      columns: [
        { id: "name", header: "Name" },
        { id: "team", header: "Team" },
        { id: "score", header: "Score", type: "number" },
      ],
      rows: [
        { id: "1", name: "Ada", team: "Ops", score: 10 },
        { id: "2", name: "Alan", team: "Ops", score: 4 },
      ],
    };
    document.body.append(table);
    await nextMicrotask();

    const subtotal = table.shadowRoot.querySelector("tr.subtotal-row");
    expect(subtotal.querySelector('td[data-column-id="name"]').textContent).to.equal("Subtotal");
    expect(subtotal.querySelector('td[data-column-id="score"]').textContent).to.equal("14");
  });

  it("keeps empty group values distinct from an __empty label", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      rowId: "id",
      groupBy: "team",
      columns: [
        { id: "name", header: "Name" },
        { id: "team", header: "Team" },
      ],
      rows: [
        { id: "1", name: "Ada", team: "" },
        { id: "2", name: "Alan", team: "__empty" },
      ],
    };
    document.body.append(table);
    await nextMicrotask();

    const headers = [...table.shadowRoot.querySelectorAll("tr.group-row .group-toggle")].map(
      (button) => button.textContent,
    );
    expect(headers).to.deep.equal(["— (1)", "__empty (1)"]);
  });

  it("uses inherited locale and property-only messages for generated operational copy", async () => {
    const wrapper = document.createElement("div");
    wrapper.lang = "de-DE";
    const table = document.createElement("rowan-table");
    table.config = {
      rowId: "id",
      selectable: "multiple",
      groupBy: { id: "team", subtotals: true },
      page: { index: 0, size: 2, total: 2 },
      columns: [
        { id: "name", header: "Name" },
        { id: "team", header: "Team" },
        { id: "amount", header: "Amount", type: "number" },
        { id: "joined", header: "Joined", type: "date" },
        { id: "active", header: "", type: "checkbox" },
        { id: "enabled", header: "", type: "switch" },
        { id: "action", header: "", type: "button" },
      ],
      rows: [
        {
          id: "order-1",
          name: "Ada",
          team: "Platform",
          amount: 1234.5,
          joined: "2026-10-12",
          active: true,
          enabled: true,
        },
        {
          id: "order-2",
          name: "Alan",
          team: "Platform",
          amount: 4,
          joined: "2026-10-13",
          active: false,
          enabled: false,
        },
      ],
    };
    wrapper.append(table);
    document.body.append(wrapper);
    await nextMicrotask();

    const events = [];
    [
      "rowan-sort",
      "rowan-select",
      "rowan-cell-change",
      "rowan-cell-action",
      "rowan-page-change",
      "rowan-group-toggle",
    ].forEach((type) => table.addEventListener(type, () => events.push(type)));
    table.messages = {
      action: "Aktion",
      empty: "Keine Daten.",
      groupLabel: "{label}: {count} Eintrage",
      loading: "Laden...",
      nextPage: "Weiter",
      paginationLabel: "Seitennavigation",
      paginationStatus: "Zeige {from}-{to} von {total}",
      previousPage: "Zuruck",
      selectAllRows: "Alle Zeilen auswahlen",
      selectRow: "Zeile {rowId} auswahlen",
      subtotal: "Zwischensumme",
    };
    await nextMicrotask();

    expect(table.getAttribute("messages")).to.equal(null);
    expect(table.locale).to.equal("de-DE");
    expect(events).to.deep.equal([]);
    expect(
      table.shadowRoot
        .querySelector('th[data-column-id="__select"] rowan-checkbox')
        .getAttribute("aria-label"),
    ).to.equal("Alle Zeilen auswahlen");
    expect(
      table.shadowRoot
        .querySelector('tr[data-row-id="order-1"] rowan-checkbox')
        .getAttribute("aria-label"),
    ).to.equal("Zeile order-1 auswahlen");
    expect(table.shadowRoot.querySelector(".group-toggle").textContent).to.equal(
      "Platform: 2 Eintrage",
    );
    expect(
      table.shadowRoot.querySelector('tr.subtotal-row td[data-column-id="name"]').textContent,
    ).to.equal("Zwischensumme");
    expect(table.shadowRoot.querySelector('td[data-column-id="amount"]').textContent).to.equal(
      new Intl.NumberFormat("de-DE").format(1234.5),
    );
    expect(table.shadowRoot.querySelector("nav.pagination").getAttribute("aria-label")).to.equal(
      "Seitennavigation",
    );
    expect(table.shadowRoot.querySelector('[data-action="prev-page"]').textContent).to.equal(
      "Zuruck",
    );
    expect(table.shadowRoot.querySelector('[data-action="next-page"]').textContent).to.equal(
      "Weiter",
    );
    expect(table.shadowRoot.querySelector(".page-status").textContent).to.equal("Zeige 1-2 von 2");
    expect(
      table.shadowRoot.querySelector('td[data-column-id="action"] rowan-button').textContent,
    ).to.equal("Aktion");

    expect(
      table.shadowRoot
        .querySelector('tr[data-row-id="order-1"] td[data-column-id="active"] rowan-checkbox')
        .getAttribute("aria-label"),
    ).to.equal("checkbox");
    expect(
      table.shadowRoot
        .querySelector('tr[data-row-id="order-1"] td[data-column-id="enabled"] rowan-switch')
        .getAttribute("aria-label"),
    ).to.equal("switch");

    table.loading = true;
    await nextMicrotask();
    expect(table.shadowRoot.querySelector(".loading-row").textContent).to.equal("Laden...");

    table.loading = false;
    table.rows = [];
    await nextMicrotask();
    expect(table.shadowRoot.querySelector("rowan-empty-state").textContent).to.equal(
      "Keine Daten.",
    );
    expect(events).to.deep.equal([]);
  });

  it("uses explicit control labels before blank-header message fallbacks", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      rowId: "id",
      columns: [
        { id: "checked", header: "", type: "checkbox" },
        {
          id: "enabled",
          header: "",
          type: "switch",
          cell: {
            label: (_value, row) => (row.id === "explicit" ? "Pin this row" : undefined),
          },
        },
      ],
      rows: [
        { id: "fallback", checked: true, enabled: false },
        { id: "explicit", checked: false, enabled: true },
      ],
    };
    table.messages = {
      checkbox: "Localized checkbox",
      switch: "Localized switch",
    };
    document.body.append(table);
    await nextMicrotask();

    expect(
      table.shadowRoot
        .querySelector('tr[data-row-id="fallback"] td[data-column-id="checked"] rowan-checkbox')
        .getAttribute("aria-label"),
    ).to.equal("Localized checkbox");
    expect(
      table.shadowRoot
        .querySelector('tr[data-row-id="fallback"] td[data-column-id="enabled"] rowan-switch')
        .getAttribute("aria-label"),
    ).to.equal("Localized switch");
    expect(
      table.shadowRoot
        .querySelector('tr[data-row-id="explicit"] td[data-column-id="enabled"] rowan-switch')
        .getAttribute("aria-label"),
    ).to.equal("Pin this row");
  });
});

describe("rowan-table column resizing", () => {
  it("adds resize handles when resizable-columns is enabled", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table resizable-columns></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = createConfig();

    await nextMicrotask();
    await waitForStyles(table);

    const resizeHandles = table.shadowRoot.querySelectorAll(".resize-handle");
    expect(resizeHandles.length).to.be.greaterThan(0);

    document.body.removeChild(host);
  });

  it("does not add resize handles when resizable-columns is disabled", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = createConfig();

    await nextMicrotask();
    await waitForStyles(table);

    const resizeHandles = table.shadowRoot.querySelectorAll(".resize-handle");
    expect(resizeHandles.length).to.equal(0);

    document.body.removeChild(host);
  });

  it("emits rowan-column-resize event when column width changes", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table resizable-columns></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = createConfig();

    await nextMicrotask();
    await waitForStyles(table);

    let resizeEvent = null;
    table.addEventListener("rowan-column-resize", (e) => {
      resizeEvent = e;
    });

    const resizeHandle = table.shadowRoot.querySelector(".resize-handle");
    expect(resizeHandle).to.exist;

    const mouseDown = new MouseEvent("mousedown", {
      clientX: 100,
      bubbles: true,
    });
    resizeHandle.dispatchEvent(mouseDown);
    const mouseMove = new MouseEvent("mousemove", { clientX: 150, bubbles: true });
    const mouseUp = new MouseEvent("mouseup", { bubbles: true });
    await waitFor(() => {
      document.dispatchEvent(mouseMove);
      document.dispatchEvent(mouseUp);
      return resizeEvent;
    });

    expect(resizeEvent).to.exist;
    expect(resizeEvent.detail.columnId).to.exist;
    expect(resizeEvent.detail.width).to.exist;

    document.body.removeChild(host);
  });

  it("supports keyboard resizing with arrow keys", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table resizable-columns></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = createConfig();

    await nextMicrotask();
    await waitForStyles(table);

    let resizeEvent = null;
    table.addEventListener("rowan-column-resize", (e) => {
      resizeEvent = e;
    });

    const resizeHandle = table.shadowRoot.querySelector(".resize-handle");
    expect(resizeHandle).to.exist;

    const keyEvent = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
    });
    resizeHandle.dispatchEvent(keyEvent);

    await waitFor(() => resizeEvent);

    expect(resizeEvent).to.exist;

    document.body.removeChild(host);
  });
});

describe("rowan-table column reordering", () => {
  it("makes columns draggable when reorderable-columns is enabled", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table reorderable-columns></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = createConfig();

    await nextMicrotask();
    await waitForStyles(table);

    const headers = table.shadowRoot.querySelectorAll("th:not(.select-column)");
    expect(headers.length).to.be.greaterThan(0);
    expect(headers[0].draggable).to.be.true;

    document.body.removeChild(host);
  });

  it("does not make columns draggable when reorderable-columns is disabled", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = createConfig();

    await nextMicrotask();
    await waitForStyles(table);

    const headers = table.shadowRoot.querySelectorAll("th:not(.select-column)");
    expect(headers.length).to.be.greaterThan(0);
    expect(headers[0].draggable).to.be.false;

    document.body.removeChild(host);
  });

  it("emits rowan-column-reorder event when columns are reordered", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table reorderable-columns></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = createConfig();

    await nextMicrotask();
    await waitForStyles(table);

    let reorderEvent = null;
    table.addEventListener("rowan-column-reorder", (e) => {
      reorderEvent = e;
    });

    const headers = table.shadowRoot.querySelectorAll("th:not(.select-column)");
    expect(headers.length).to.be.greaterThan(1);

    const dragStart = new DragEvent("dragstart", {
      dataTransfer: new DataTransfer(),
      bubbles: true,
    });
    headers[0].dispatchEvent(dragStart);

    const dragOver = new DragEvent("dragover", {
      dataTransfer: new DataTransfer(),
      bubbles: true,
    });
    headers[1].dispatchEvent(dragOver);

    const drop = new DragEvent("drop", {
      dataTransfer: new DataTransfer(),
      bubbles: true,
    });
    headers[1].dispatchEvent(drop);

    await nextMicrotask();

    expect(reorderEvent).to.exist;
    expect(reorderEvent.detail.fromIndex).to.exist;
    expect(reorderEvent.detail.toIndex).to.exist;

    document.body.removeChild(host);
  });

  it("supports keyboard reordering with Alt+Arrow keys", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table reorderable-columns></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = createConfig();

    await nextMicrotask();
    await waitForStyles(table);

    let reorderEvent = null;
    table.addEventListener("rowan-column-reorder", (e) => {
      reorderEvent = e;
    });

    const headers = table.shadowRoot.querySelectorAll("th:not(.select-column)");

    const keyEvent = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      altKey: true,
      bubbles: true,
    });
    headers[0].dispatchEvent(keyEvent);

    await nextMicrotask();

    expect(reorderEvent).to.exist;
    expect(reorderEvent.detail.columns).to.exist;

    document.body.removeChild(host);
  });
});

describe("rowan-table-toolbar ARIA", () => {
  it("has role='toolbar' with aria-label", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table-toolbar label="Table controls"></rowan-table-toolbar>`;
    const toolbar = host.querySelector("rowan-table-toolbar");

    await nextMicrotask();
    await waitForStyles(toolbar);

    const toolbarEl = toolbar.shadowRoot.querySelector(".toolbar");
    expect(toolbarEl.getAttribute("role")).to.equal("toolbar");
    expect(toolbarEl.getAttribute("aria-label")).to.equal("Table controls");

    document.body.removeChild(host);
  });
});
describe("inline editing", () => {
  it("marks editable cells with data-editable and tabindex", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = {
      columns: [
        { id: "name", header: "Name", editable: true },
        { id: "age", header: "Age", type: "number", editable: false }
      ],
      rows: [{ id: "1", name: "Alice", age: 30 }]
    };

    await nextMicrotask();
    await waitForStyles(table);

    const nameCell = table.shadowRoot.querySelector('td[data-column-id="name"]');
    const ageCell = table.shadowRoot.querySelector('td[data-column-id="age"]');

    expect(nameCell.getAttribute("data-editable")).to.equal("true");
    expect(nameCell.getAttribute("tabindex")).to.equal("0");
    expect(ageCell.hasAttribute("data-editable")).to.be.false;

    document.body.removeChild(host);
  });

  it("starts editing on Enter key", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = {
      columns: [{ id: "name", header: "Name", editable: true }],
      rows: [{ id: "1", name: "Alice" }]
    };

    await nextMicrotask();
    await waitForStyles(table);

    let editStarted = false;
    table.addEventListener("rowan-edit-start", () => { editStarted = true; });

    const cell = table.shadowRoot.querySelector('td[data-column-id="name"]');
    cell.focus();
    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    await waitFor(() => cell.querySelector(".cell-editor"));

    expect(editStarted).to.be.true;
    expect(cell.classList.contains("editing")).to.be.true;
    const editor = cell.querySelector(".cell-editor");
    expect(editor).to.exist;
    expect(editor.value).to.equal("Alice");

    document.body.removeChild(host);
  });

  it("starts editing on F2 key", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = {
      columns: [{ id: "name", header: "Name", editable: true }],
      rows: [{ id: "1", name: "Bob" }]
    };

    await nextMicrotask();
    await waitForStyles(table);

    let editStarted = false;
    table.addEventListener("rowan-edit-start", () => { editStarted = true; });

    const cell = table.shadowRoot.querySelector('td[data-column-id="name"]');
    cell.focus();
    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "F2", bubbles: true }));

    await waitFor(() => cell.classList.contains("editing"));

    expect(editStarted).to.be.true;
    expect(cell.classList.contains("editing")).to.be.true;

    document.body.removeChild(host);
  });

  it("cancels editing on Escape", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = {
      columns: [{ id: "name", header: "Name", editable: true }],
      rows: [{ id: "1", name: "Alice" }]
    };

    await nextMicrotask();
    await waitForStyles(table);

    let cancelDetail = null;
    table.addEventListener("rowan-edit-cancel", (e) => { cancelDetail = e.detail; });

    const cell = table.shadowRoot.querySelector('td[data-column-id="name"]');
    cell.focus();
    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    await waitFor(() => cell.querySelector(".cell-editor"));

    const editor = cell.querySelector(".cell-editor");
    editor.value = "Changed";
    editor.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    await nextMicrotask();

    expect(cell.classList.contains("editing")).to.be.false;
    expect(cancelDetail.columnId).to.equal("name");
    expect(table.rows[0].name).to.equal("Alice");

    document.body.removeChild(host);
  });

  it("commits editing on Enter", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = {
      columns: [{ id: "name", header: "Name", editable: true }],
      rows: [{ id: "1", name: "Alice" }]
    };

    await nextMicrotask();
    await waitForStyles(table);

    let commitDetail = null;
    table.addEventListener("rowan-edit-commit", (e) => { commitDetail = e.detail; });

    const cell = table.shadowRoot.querySelector('td[data-column-id="name"]');
    cell.focus();
    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    await waitFor(() => cell.querySelector(".cell-editor"));

    const editor = cell.querySelector(".cell-editor");
    editor.value = "Bob";
    editor.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    await nextMicrotask();

    expect(commitDetail.value).to.equal("Bob");
    expect(commitDetail.oldValue).to.equal("Alice");
    expect(table.rows[0].name).to.equal("Bob");

    document.body.removeChild(host);
  });

  it("supports number editors with constraints", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = {
      columns: [
        { 
          id: "age", 
          header: "Age", 
          type: "number", 
          editable: true,
          editor: { type: "number", min: 0, max: 120, step: 1 }
        }
      ],
      rows: [{ id: "1", age: 30 }]
    };

    await nextMicrotask();
    await waitForStyles(table);

    const cell = table.shadowRoot.querySelector('td[data-column-id="age"]');
    cell.focus();
    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    await waitFor(() => cell.querySelector(".cell-editor"));

    const editor = cell.querySelector(".cell-editor");
    expect(editor.type).to.equal("number");
    expect(editor.min).to.equal("0");
    expect(editor.max).to.equal("120");
    expect(editor.step).to.equal("1");

    document.body.removeChild(host);
  });

  it("supports conditional editable via function", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = {
      columns: [
        { 
          id: "name", 
          header: "Name", 
          editable: (row) => row.id !== "2"
        }
      ],
      rows: [
        { id: "1", name: "Alice" },
        { id: "2", name: "Bob" }
      ]
    };

    await nextMicrotask();
    await waitForStyles(table);

    const cells = table.shadowRoot.querySelectorAll('td[data-column-id="name"]');
    expect(cells[0].getAttribute("data-editable")).to.equal("true");
    expect(cells[1].hasAttribute("data-editable")).to.be.false;

    document.body.removeChild(host);
  });

  it("works efficiently on large tables (10,000 rows)", async function () {
    this.timeout(10000);
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");

    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      id: String(i),
      name: `Row ${i}`,
      value: i * 10,
    }));

    table.config = {
      columns: [
        { id: "name", header: "Name", editable: true },
        { id: "value", header: "Value", type: "number", editable: true },
      ],
      rows: largeDataset,
    };

    await nextMicrotask();
    await waitForStyles(table);

    const firstEditableCell = table.renderRoot.querySelector('td[data-editable="true"]');
    expect(firstEditableCell).to.exist;

    const startTime = performance.now();
    firstEditableCell.focus();
    firstEditableCell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    let input = null;
    while (!input && performance.now() - startTime < 500) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      input = table.renderRoot.querySelector("input.cell-editor");
    }
    const endTime = performance.now();

    expect(input).to.exist;
    expect(endTime - startTime).to.be.lessThan(500);

    document.body.removeChild(host);
  });

  it("supports select editor", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");

    table.config = {
      columns: [
        {
          id: "status",
          header: "Status",
          editable: true,
          editor: {
            type: "select",
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ],
          },
        },
      ],
      rows: [{ id: "1", status: "active" }],
    };

    await nextMicrotask();
    await waitForStyles(table);

    const cell = table.renderRoot.querySelector('td[data-editable="true"]');
    cell.focus();
    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await waitFor(() => cell.querySelector("rowan-select"));

    const select = cell.querySelector("rowan-select");
    expect(select).to.exist;
    expect(select.options.map((option) => option.value)).to.deep.equal(["active", "inactive"]);
    expect(select.value).to.equal("active");

    document.body.removeChild(host);
  });

  it("commits select editor value correctly", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");

    table.config = {
      columns: [
        {
          id: "status",
          header: "Status",
          editable: true,
          editor: {
            type: "select",
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ],
          },
        },
      ],
      rows: [{ id: "1", status: "active" }],
    };

    await nextMicrotask();
    await waitForStyles(table);

    let commitEvent = null;
    table.addEventListener("rowan-edit-commit", (e) => {
      commitEvent = e;
    });

    const cell = table.renderRoot.querySelector('td[data-editable="true"]');
    cell.focus();
    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await waitFor(() => cell.querySelector("rowan-select"));

    const select = cell.querySelector("rowan-select");
    select.value = "inactive";
    select.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await nextMicrotask();

    expect(commitEvent).to.exist;
    expect(commitEvent.detail.value).to.equal("inactive");
    expect(commitEvent.detail.oldValue).to.equal("active");
    expect(table.rows[0].status).to.equal("inactive");

    document.body.removeChild(host);
  });

  it("supports date editor", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");

    table.config = {
      columns: [
        {
          id: "date",
          header: "Date",
          editable: true,
          editor: { type: "date" },
        },
      ],
      rows: [{ id: "1", date: "2024-01-01" }],
    };

    await nextMicrotask();
    await waitForStyles(table);

    const cell = table.renderRoot.querySelector('td[data-editable="true"]');
    cell.focus();
    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await waitFor(() => cell.querySelector("rowan-date-picker"));

    const datePicker = cell.querySelector("rowan-date-picker");
    expect(datePicker).to.exist;
    expect(datePicker.value).to.equal("2024-01-01");

    document.body.removeChild(host);
  });

  it("supports checkbox editor", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");

    table.config = {
      columns: [
        {
          id: "active",
          header: "Active",
          editable: true,
          editor: { type: "checkbox" },
        },
      ],
      rows: [{ id: "1", active: true }],
    };

    await nextMicrotask();
    await waitForStyles(table);

    const cell = table.renderRoot.querySelector('td[data-editable="true"]');
    cell.focus();
    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await waitFor(() => cell.querySelector("rowan-checkbox"));

    const checkbox = cell.querySelector("rowan-checkbox");
    expect(checkbox).to.exist;
    expect(checkbox.checked).to.be.true;

    document.body.removeChild(host);
  });

  it("supports custom editor", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");

    table.config = {
      columns: [
        {
          id: "custom",
          header: "Custom",
          editable: true,
          editor: {
            type: "custom",
            render: (context) => {
              const input = document.createElement("input");
              input.value = context.value || "";
              input.className = "custom-editor";
              return input;
            },
          },
        },
      ],
      rows: [{ id: "1", custom: "test" }],
    };

    await nextMicrotask();
    await waitForStyles(table);

    const cell = table.renderRoot.querySelector('td[data-editable="true"]');
    cell.focus();
    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await waitFor(() => cell.querySelector(".custom-editor"));

    const customInput = cell.querySelector(".custom-editor");
    expect(customInput).to.exist;
    expect(customInput.value).to.equal("test");
    expect(customInput.classList.contains("custom-editor")).to.equal(true);
    expect(customInput.classList.contains("cell-editor")).to.equal(true);

    document.body.removeChild(host);
  });

  it("supports row edit mode", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table edit-mode="row"></rowan-table>`;
    const table = host.querySelector("rowan-table");

    table.config = {
      columns: [
        { id: "name", header: "Name", editable: true },
        { id: "age", header: "Age", type: "number", editable: true },
      ],
      rows: [{ id: "1", name: "Alice", age: 30 }],
    };

    await nextMicrotask();
    await waitForStyles(table);

    const firstCell = table.renderRoot.querySelector('td[data-editable="true"]');
    firstCell.focus();
    firstCell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await waitFor(() => table.renderRoot.querySelectorAll("input").length === 2);

    const inputs = table.renderRoot.querySelectorAll("input");
    expect(inputs.length).to.equal(2);

    document.body.removeChild(host);
  });

  it("commits row edit with rowan-row-edit-commit event", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table edit-mode="row"></rowan-table>`;
    const table = host.querySelector("rowan-table");

    table.config = {
      columns: [
        { id: "name", header: "Name", editable: true },
        { id: "age", header: "Age", type: "number", editable: true },
      ],
      rows: [{ id: "1", name: "Alice", age: 30 }],
    };

    await nextMicrotask();
    await waitForStyles(table);

    let commitEvent = null;
    table.addEventListener("rowan-row-edit-commit", (e) => {
      commitEvent = e;
    });

    const firstCell = table.renderRoot.querySelector('td[data-editable="true"]');
    firstCell.focus();
    firstCell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await waitFor(() => table.renderRoot.querySelector('input[type="text"]'));

    const nameInput = table.renderRoot.querySelector('input[type="text"]');
    nameInput.value = "Bob";
    nameInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await nextMicrotask();

    expect(commitEvent).to.exist;
    expect(commitEvent.detail.values.name).to.equal("Bob");
    expect(commitEvent.detail.oldValues.name).to.equal("Alice");
    expect(table.rows[0].name).to.equal("Bob");

    document.body.removeChild(host);
  });

  it("leaves the row unchanged when rowan-row-edit-commit is cancelled", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table edit-mode="row"></rowan-table>`;
    const table = host.querySelector("rowan-table");

    table.config = {
      columns: [
        { id: "name", header: "Name", editable: true },
        { id: "age", header: "Age", type: "number", editable: true },
      ],
      rows: [{ id: "1", name: "Alice", age: 30 }],
    };

    await nextMicrotask();
    await waitForStyles(table);

    table.addEventListener("rowan-row-edit-commit", (event) => {
      event.preventDefault();
    });

    const firstCell = table.renderRoot.querySelector('td[data-editable="true"]');
    firstCell.focus();
    firstCell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await waitFor(() => table.renderRoot.querySelector('input[type="text"]'));

    const nameInput = table.renderRoot.querySelector('input[type="text"]');
    nameInput.value = "Bob";
    nameInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await nextMicrotask();

    expect(table.rows[0].name).to.equal("Alice");
    expect(table.renderRoot.querySelectorAll("input").length).to.equal(0);

    document.body.removeChild(host);
  });

  it("cancels row edit with Escape", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table edit-mode="row"></rowan-table>`;
    const table = host.querySelector("rowan-table");

    table.config = {
      columns: [
        { id: "name", header: "Name", editable: true },
        { id: "age", header: "Age", type: "number", editable: true },
      ],
      rows: [{ id: "1", name: "Alice", age: 30 }],
    };

    await nextMicrotask();
    await waitForStyles(table);

    let cancelEvent = null;
    table.addEventListener("rowan-row-edit-cancel", (e) => {
      cancelEvent = e;
    });

    const firstCell = table.renderRoot.querySelector('td[data-editable="true"]');
    firstCell.focus();
    firstCell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await waitFor(() => table.renderRoot.querySelector('input[type="text"]'));

    const nameInput = table.renderRoot.querySelector('input[type="text"]');
    nameInput.value = "Bob";
    nameInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextMicrotask();

    expect(cancelEvent).to.exist;
    expect(table.renderRoot.querySelectorAll("input").length).to.equal(0);

    document.body.removeChild(host);
  });

  it("supports Tab navigation in row edit mode", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table edit-mode="row"></rowan-table>`;
    const table = host.querySelector("rowan-table");

    table.config = {
      columns: [
        { id: "name", header: "Name", editable: true },
        { id: "age", header: "Age", type: "number", editable: true },
      ],
      rows: [{ id: "1", name: "Alice", age: 30 }],
    };

    await nextMicrotask();
    await waitForStyles(table);

    const firstCell = table.renderRoot.querySelector('td[data-editable="true"]');
    firstCell.focus();
    firstCell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await waitFor(() => table.renderRoot.querySelector('input[type="text"]'));

    const nameInput = table.renderRoot.querySelector('input[type="text"]');
    nameInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    await nextMicrotask();

    const ageInput = table.renderRoot.querySelector('input[type="number"]');
    expect(table.shadowRoot.activeElement).to.equal(ageInput);

    document.body.removeChild(host);
  });

  it("keeps a required cell in edit mode and exposes the error", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = {
      columns: [{ id: "name", header: "Name", editable: true, required: true }],
      rows: [{ id: "1", name: "Alice" }],
    };

    await nextMicrotask();
    await waitForStyles(table);

    let committed = false;
    table.addEventListener("rowan-edit-commit", () => {
      committed = true;
    });

    const cell = table.renderRoot.querySelector('td[data-editable="true"]');
    cell.focus();
    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await waitFor(() => cell.querySelector(".cell-editor"));

    const editor = cell.querySelector(".cell-editor");
    editor.value = "   ";
    editor.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await nextMicrotask();

    const error = cell.querySelector(".cell-editor-error");
    expect(committed).to.equal(false);
    expect(cell.classList.contains("editing")).to.equal(true);
    expect(editor.getAttribute("aria-invalid")).to.equal("true");
    expect(cell.getAttribute("aria-invalid")).to.equal("true");
    expect(error).to.exist;
    expect(error.textContent).to.equal("Required");
    expect(editor.getAttribute("aria-describedby")).to.equal(error.id);
    expect(cell.getAttribute("aria-describedby")).to.equal(error.id);
    expect(table.rows[0].name).to.equal("Alice");

    document.body.removeChild(host);
  });

  it("uses column validate messages and commits when validate returns true", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = {
      columns: [
        {
          id: "email",
          header: "Email",
          editable: true,
          validate: (value) => (String(value).includes("@") ? true : "Enter an email address"),
        },
      ],
      rows: [{ id: "1", email: "ada@example.com" }],
    };

    await nextMicrotask();
    await waitForStyles(table);

    const cell = table.renderRoot.querySelector('td[data-editable="true"]');
    cell.focus();
    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await waitFor(() => cell.querySelector(".cell-editor"));

    const editor = cell.querySelector(".cell-editor");
    editor.value = "not-an-email";
    editor.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await nextMicrotask();

    expect(cell.querySelector(".cell-editor-error").textContent).to.equal("Enter an email address");
    expect(table.rows[0].email).to.equal("ada@example.com");

    editor.value = "grace@example.com";
    editor.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await nextMicrotask();

    expect(cell.classList.contains("editing")).to.equal(false);
    expect(table.rows[0].email).to.equal("grace@example.com");

    document.body.removeChild(host);
  });

  it("rejects a value when rowan-edit-validate is cancelled", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = {
      columns: [{ id: "name", header: "Name", editable: true }],
      rows: [{ id: "1", name: "Alice" }],
    };

    await nextMicrotask();
    await waitForStyles(table);

    table.addEventListener("rowan-edit-validate", (event) => {
      event.detail.message = "Name is locked";
      event.preventDefault();
    });

    const cell = table.renderRoot.querySelector('td[data-editable="true"]');
    cell.focus();
    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await waitFor(() => cell.querySelector(".cell-editor"));

    const editor = cell.querySelector(".cell-editor");
    editor.value = "Bob";
    editor.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await nextMicrotask();

    expect(cell.querySelector(".cell-editor-error").textContent).to.equal("Name is locked");
    expect(editor.getAttribute("aria-invalid")).to.equal("true");
    expect(table.rows[0].name).to.equal("Alice");

    document.body.removeChild(host);
  });

  it("blocks a row commit until every cell is valid", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    host.innerHTML = `<rowan-table edit-mode="row"></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = {
      columns: [
        { id: "name", header: "Name", editable: true, required: true },
        {
          id: "age",
          header: "Age",
          type: "number",
          editable: true,
          validate: (value) => (Number(value) >= 18 ? true : "Must be 18 or older"),
        },
      ],
      rows: [{ id: "1", name: "Alice", age: 30 }],
    };

    await nextMicrotask();
    await waitForStyles(table);

    let committed = false;
    table.addEventListener("rowan-row-edit-commit", () => {
      committed = true;
    });

    const firstCell = table.renderRoot.querySelector('td[data-editable="true"]');
    firstCell.focus();
    firstCell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await waitFor(() => table.renderRoot.querySelector('input[type="text"]'));

    const nameInput = table.renderRoot.querySelector('input[type="text"]');
    const ageInput = table.renderRoot.querySelector('input[type="number"]');
    nameInput.value = "";
    ageInput.value = "12";
    nameInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await nextMicrotask();

    expect(committed).to.equal(false);
    expect(table.renderRoot.querySelectorAll("input").length).to.equal(2);
    expect(nameInput.getAttribute("aria-invalid")).to.equal("true");
    expect(ageInput.getAttribute("aria-invalid")).to.equal("true");
    expect(table.renderRoot.querySelectorAll(".cell-editor-error").length).to.equal(2);
    expect(table.rows[0].name).to.equal("Alice");
    expect(table.rows[0].age).to.equal(30);

    nameInput.value = "Ada";
    ageInput.value = "21";
    nameInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await nextMicrotask();

    expect(committed).to.equal(true);
    expect(table.rows[0].name).to.equal("Ada");
    expect(table.rows[0].age).to.equal(21);
    expect(table.renderRoot.querySelectorAll("input").length).to.equal(0);

    document.body.removeChild(host);
  });
});

describe("server data", () => {
  function people(count = 25) {
    return Array.from({ length: count }, (_, index) => ({
      id: `p-${index + 1}`,
      name: `N${String(index + 1).padStart(2, "0")}`,
      city: index % 2 === 0 ? "Paris" : "Lyon",
    }));
  }

  function mount(getRows, { debounce = 0, pageSize = 10 } = {}) {
    const host = document.createElement("div");
    document.body.appendChild(host);
    host.innerHTML = `<rowan-table data-mode="server"></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = {
      columns: [
        { id: "name", header: "Name", sortable: true, editable: true },
        { id: "city", header: "City", sortable: true },
      ],
      page: { index: 0, size: pageSize },
    };
    table.dataSource = { debounce, getRows };
    return { host, table };
  }

  it("requests a page instead of slicing local rows", async () => {
    const calls = [];
    const { host, table } = mount(({ page, pageSize, signal }) => {
      calls.push({ page, pageSize, aborted: signal.aborted });
      const rows = people().slice(page * pageSize, page * pageSize + pageSize);
      return Promise.resolve({ rows, total: 25 });
    });

    await waitFor(() => table.renderRoot.textContent.includes("N01"));
    expect(calls.at(-1)).to.deep.equal({ page: 0, pageSize: 10, aborted: false });
    expect(table.renderRoot.textContent.includes("N11")).to.equal(false);

    table.renderRoot.querySelector('[data-action="next-page"]').click();
    await waitFor(() => table.renderRoot.textContent.includes("N11"));
    expect(calls.at(-1).page).to.equal(1);
    expect(table.renderRoot.textContent.includes("N01")).to.equal(false);

    document.body.removeChild(host);
  });

  it("sends sort and debounced filters to the data source", async () => {
    const calls = [];
    const { host, table } = mount((query) => {
      calls.push({ sort: query.sort, filters: query.filters, page: query.page });
      return Promise.resolve({ rows: people(1), total: 1 });
    }, { debounce: 30 });

    await waitFor(() => calls.length >= 1);
    table.renderRoot.querySelector('th[data-column-id="city"] .sort-button').click();
    await waitFor(() => calls.some((call) => call.sort?.[0]?.id === "city" && call.sort[0].dir === "asc"));
    expect(calls.at(-1).page).to.equal(0);

    const before = calls.length;
    table.filters = [{ id: "name", value: "a" }];
    table.filters = [{ id: "name", value: "ann" }];
    await new Promise((resolve) => setTimeout(resolve, 80));
    const filterCalls = calls.slice(before);
    expect(filterCalls.length).to.equal(1);
    expect(filterCalls[0].filters).to.deep.equal([{ id: "name", value: "ann" }]);
    expect(filterCalls[0].page).to.equal(0);

    document.body.removeChild(host);
  });

  it("passes a filter tree through to the data source", async () => {
    const calls = [];
    const { host, table } = mount((query) => {
      calls.push(query.filters);
      return Promise.resolve({ rows: [], total: 0 });
    }, { debounce: 20 });

    await waitFor(() => calls.length >= 1);
    const tree = [
      { id: "q", value: "ada" },
      {
        id: "g1",
        join: "or",
        filters: [
          { id: "a", field: "role", operator: "equals", value: "Admin" },
          { id: "b", field: "name", operator: "contains", value: "Ada" },
        ],
      },
    ];
    table.filters = tree;
    await new Promise((resolve) => setTimeout(resolve, 60));
    const sent = calls.at(-1);
    expect(sent).to.deep.equal(tree);
    sent[1].filters[0].value = "changed";
    expect(tree[1].filters[0].value).to.equal("Admin");

    document.body.removeChild(host);
  });

  it("ignores a stale response after a newer request", async () => {
    let releaseFirst;
    const first = new Promise((resolve) => {
      releaseFirst = resolve;
    });
    let generation = 0;
    const { host, table } = mount(() => {
      generation += 1;
      const current = generation;
      if (current === 1) {
        return first.then(() => ({ rows: [{ id: "stale", name: "Stale" }], total: 1 }));
      }
      return Promise.resolve({ rows: [{ id: "fresh", name: "Fresh", city: "Nice" }], total: 1 });
    });

    await waitFor(() => generation === 1);
    table.renderRoot.querySelector('th[data-column-id="name"] button').click();
    await waitFor(() => table.renderRoot.textContent.includes("Fresh"));
    releaseFirst();
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(table.renderRoot.textContent.includes("Stale")).to.equal(false);
    expect(table.renderRoot.textContent.includes("Fresh")).to.equal(true);

    document.body.removeChild(host);
  });

  it("skips the read when rowan-data-request is cancelled", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = {
      columns: [{ id: "name", header: "Name" }],
      page: { index: 0, size: 5 },
    };
    let reads = 0;
    table.addEventListener("rowan-data-request", (event) => event.preventDefault());
    table.dataSource = {
      debounce: 0,
      getRows: () => {
        reads += 1;
        return Promise.resolve({ rows: people(1), total: 1 });
      },
    };
    table.dataMode = "server";
    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(reads).to.equal(0);
    expect(table.renderRoot.querySelector("[data-action='retry-load']")).to.equal(null);

    document.body.removeChild(host);
  });

  it("shows an error with retry and announces loading", async () => {
    let attempt = 0;
    const { host, table } = mount(() => {
      attempt += 1;
      if (attempt === 1) return Promise.reject(new Error("offline"));
      return Promise.resolve({ rows: [{ id: "1", name: "Recovered", city: "Lille" }], total: 1 });
    });

    await waitFor(() => table.renderRoot.querySelector("[data-action='retry-load']"));
    const status = table.renderRoot.querySelector(".data-status");
    expect(status.getAttribute("role")).to.equal("status");
    expect(status.textContent).to.equal("Could not load rows.");
    expect(table.renderRoot.querySelector("table").getAttribute("aria-busy")).to.equal("false");
    expect(table.renderRoot.textContent).to.include("Unable to load rows.");
    expect(table.renderRoot.textContent).to.include("Retry");

    table.renderRoot.querySelector("[data-action='retry-load']").click();
    await waitFor(() => table.renderRoot.querySelector("table").getAttribute("aria-busy") === "true" || table.renderRoot.textContent.includes("Recovered"));
    await waitFor(() => table.renderRoot.textContent.includes("Recovered"));
    expect(table.renderRoot.querySelector(".data-status").textContent).to.equal("Loaded 1 rows.");

    document.body.removeChild(host);
  });

  it("keeps selected ids when the page changes", async () => {
    const { host, table } = mount(({ page, pageSize }) => {
      const rows = people().slice(page * pageSize, page * pageSize + pageSize);
      return Promise.resolve({ rows, total: 25 });
    }, { pageSize: 5 });
    table.selectable = "multiple";

    await waitFor(() => table.renderRoot.textContent.includes("N01"));
    const box = table.renderRoot.querySelector("td rowan-checkbox");
    box.checked = true;
    box.dispatchEvent(new CustomEvent("rowan-change", { bubbles: true, composed: true }));
    await nextMicrotask();
    const selectedId = table.selected[0];
    expect(selectedId).to.equal("p-1");

    table.renderRoot.querySelector('[data-action="next-page"]').click();
    await waitFor(() => table.renderRoot.textContent.includes("N06"));
    expect(table.selected).to.include(selectedId);
    expect(table.renderRoot.textContent.includes("N01")).to.equal(false);

    document.body.removeChild(host);
  });
});

describe("clipboard and export", () => {
  function mount(config) {
    const host = document.createElement("div");
    document.body.appendChild(host);
    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = config;
    return { host, table };
  }

  function stubClipboard() {
    const writes = [];
    const original = navigator.clipboard;
    const clipboard = {
      async write(items) {
        const record = {};
        for (const item of items) {
          for (const type of item.types) record[type] = await (await item.getType(type)).text();
        }
        writes.push(record);
      },
      async writeText(text) {
        writes.push({ "text/plain": text });
      },
    };
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: clipboard });
    return {
      writes,
      restore() {
        Object.defineProperty(navigator, "clipboard", { configurable: true, value: original });
      },
    };
  }

  const rows = [
    { id: "a", name: "Ada", note: "Hello, \"world\"", score: 12, flag: true, joined: new Date(2020, 0, 15), secret: "hidden" },
    { id: "b", name: "=cmd|' /C calc'!A0", note: "Plain", score: -3, flag: false, joined: new Date(2021, 5, 1), secret: "nope" },
  ];

  const columns = [
    { id: "name", header: "Name", format: (value) => String(value).toUpperCase() },
    { id: "note", header: "Note" },
    { id: "score", header: "Score", type: "number" },
    { id: "flag", header: "Flag", type: "checkbox" },
    { id: "joined", header: "Joined", type: "date" },
    { id: "secret", header: "Secret", hidden: true },
  ];

  it("copies selected rows as TSV and HTML and skips hidden columns", async () => {
    const clipboard = stubClipboard();
    const { host, table } = mount({ columns, rows, rowId: "id", selectable: "multiple" });
    table.selected = ["b"];
    const result = await table.copyToClipboard({ includeHeaders: true });
    expect(result.copied).to.equal(true);
    expect(result.text).to.equal(
      `Name\tNote\tScore\tFlag\tJoined\n'=CMD|' /C CALC'!A0\tPlain\t-3\tfalse\t${String(rows[1].joined)}`,
    );
    expect(result.html).to.include("<th>Name</th>");
    expect(result.html).to.not.include("Hello");
    expect(result.text).to.not.include("hidden");
    expect(clipboard.writes[0]["text/plain"]).to.equal(result.text);
    expect(clipboard.writes[0]["text/html"]).to.include("<table>");
    expect(table.renderRoot.querySelector(".data-status").textContent).to.equal("Copied 1 rows.");
    clipboard.restore();
    document.body.removeChild(host);
  });

  it("copies the focused cell when nothing is selected", async () => {
    const clipboard = stubClipboard();
    const { host, table } = mount({ columns, rows, rowId: "id" });
    await nextFrame();
    const cell = table.renderRoot.querySelector('td[data-column-id="note"]');
    cell.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "c", ctrlKey: true, bubbles: true }));
    await waitFor(() => clipboard.writes.length === 1);
    expect(clipboard.writes[0]["text/plain"]).to.equal('Hello, "world"');
    expect(table.renderRoot.querySelector(".data-status").textContent).to.equal("Copied 1 cell.");
    clipboard.restore();
    document.body.removeChild(host);
  });

  it("lets rowan-copy replace the payload or cancel the write", async () => {
    const clipboard = stubClipboard();
    const { host, table } = mount({ columns, rows, rowId: "id", selectable: "multiple" });
    table.selected = ["a"];
    table.addEventListener("rowan-copy", (event) => {
      event.detail.text = "custom";
      event.detail.html = "<table><tr><td>custom</td></tr></table>";
    });
    const replaced = await table.copyToClipboard();
    expect(replaced.text).to.equal("custom");
    expect(clipboard.writes.at(-1)["text/plain"]).to.equal("custom");

    table.addEventListener("rowan-copy", (event) => event.preventDefault(), { once: true });
    const blocked = await table.copyToClipboard();
    expect(blocked.copied).to.equal(false);
    expect(blocked.prevented).to.equal(true);
    expect(clipboard.writes.length).to.equal(1);
    clipboard.restore();
    document.body.removeChild(host);
  });

  it("escapes CSV fields and guards formula injection", async () => {
    const { host, table } = mount({ columns, rows, rowId: "id" });
    const result = await table.exportCsv({ filename: "people.csv", scope: "all" });
    expect(result.exported).to.equal(true);
    expect(result.filename).to.equal("people.csv");
    expect(result.csv.startsWith("\uFEFF")).to.equal(true);
    const body = result.csv.slice(1);
    expect(body.split("\r\n")[0]).to.equal("Name,Note,Score,Flag,Joined");
    expect(body).to.include('"Hello, ""world"""');
    expect(body).to.include("'=CMD|' /C CALC'!A0");
    expect(body).to.not.include("hidden");
    expect(body).to.include("-3");
    expect(table.renderRoot.querySelector(".data-status").textContent).to.equal("Exported people.csv.");

    table.addEventListener("rowan-export", (event) => {
      event.detail.filename = "renamed.csv";
      event.detail.rows = [["safe"]];
    });
    const renamed = await table.exportCsv({ scope: "selected", includeHeaders: false });
    expect(renamed.filename).to.equal("renamed.csv");
    expect(renamed.csv).to.include("safe");
    expect(renamed.csv).to.not.include("Ada");
    document.body.removeChild(host);
  });

  it("writes a stored xlsx workbook with typed values and a bold header", async () => {
    const { readStoredZip } = await import("./table-export.js");
    const { host, table } = mount({ columns, rows, rowId: "id" });
    const result = await table.exportExcel({
      filename: "people.xlsx",
      scope: "all",
      formatValues: false,
      columns: ["name", "score", "flag", "joined", "secret"],
    });
    expect(result.exported).to.equal(true);
    const files = readStoredZip(result.bytes);
    expect(files.has("[Content_Types].xml")).to.equal(true);
    expect(files.get("xl/workbook.xml")).to.include('sheet name="Sheet1"');
    const sheet = files.get("xl/worksheets/sheet1.xml");
    expect(sheet).to.include('s="1"');
    expect(sheet).to.include("Ada");
    expect(sheet).to.include("'=cmd|' /C calc'!A0");
    expect(sheet).to.include("<v>12</v>");
    expect(sheet).to.include('t="b"');
    expect(sheet).to.include('s="2"');
    const serial = String(Math.round((Date.UTC(2020, 0, 15) - Date.UTC(1899, 11, 30)) / 86400000));
    expect(sheet).to.include(`<v>${serial}</v>`);
    expect(sheet).to.include("hidden");
    expect(files.get("xl/styles.xml")).to.include("<b/>");
    document.body.removeChild(host);
  });

  it("exports the current page, selected rows, and column order", async () => {
    const { host, table } = mount({
      columns,
      rows,
      rowId: "id",
      selectable: "multiple",
      page: { index: 0, size: 1 },
    });
    const page = await table.exportCsv({ scope: "page", includeHeaders: false, formatValues: false, guardFormulas: false });
    expect(page.csv).to.include("Ada");
    expect(page.csv).to.not.include("=cmd");

    table.selected = ["b"];
    const selected = await table.exportCsv({
      scope: "selected",
      includeHeaders: false,
      formatValues: false,
      guardFormulas: false,
    });
    expect(selected.csv).to.include("=cmd|' /C calc'!A0");
    expect(selected.csv).to.not.include("Ada");

    const ordered = await table.exportCsv({
      scope: "all",
      columns: ["score", "name"],
      includeHeaders: true,
      formatValues: false,
      guardFormulas: false,
    });
    expect(ordered.csv.slice(1).split("\r\n")[0]).to.equal("Score,Name");
    document.body.removeChild(host);
  });

  it("exports the loaded server page unless getRows supplies the rest", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    host.innerHTML = `<rowan-table data-mode="server"></rowan-table>`;
    const table = host.querySelector("rowan-table");
    const all = [
      { id: "1", name: "One" },
      { id: "2", name: "Two" },
      { id: "3", name: "Three" },
    ];
    table.config = {
      columns: [{ id: "name", header: "Name" }],
      page: { index: 0, size: 2 },
    };
    table.dataSource = {
      debounce: 0,
      getRows: ({ page, pageSize }) => {
        const start = page * pageSize;
        return Promise.resolve({ rows: all.slice(start, start + pageSize), total: all.length });
      },
    };
    await waitFor(() => table.renderRoot.textContent.includes("One"));
    const loaded = await table.exportCsv({ includeHeaders: false, guardFormulas: false });
    expect(loaded.scope).to.equal("page");
    expect(loaded.csv).to.include("One");
    expect(loaded.csv).to.include("Two");
    expect(loaded.csv).to.not.include("Three");

    const full = await table.exportCsv({
      scope: "all",
      includeHeaders: false,
      guardFormulas: false,
      getRows: async () => all,
    });
    expect(full.truncated).to.equal(false);
    expect(full.csv).to.include("Three");

    const truncated = await table.exportCsv({ scope: "all", includeHeaders: false, guardFormulas: false });
    expect(truncated.truncated).to.equal(true);
    expect(truncated.csv).to.not.include("Three");

    table.selectable = "multiple";
    table.selected = ["1", "3"];
    const selected = await table.exportCsv({ scope: "selected", includeHeaders: false, guardFormulas: false });
    expect(selected.csv).to.include("One");
    expect(selected.csv).to.not.include("Three");

    table.addEventListener("rowan-export", (event) => event.preventDefault(), { once: true });
    const blocked = await table.exportCsv();
    expect(blocked.exported).to.equal(false);
    expect(blocked.prevented).to.equal(true);
    document.body.removeChild(host);
  });
});

describe("paste", () => {
  function mount(config) {
    const host = document.createElement("div");
    document.body.appendChild(host);
    host.innerHTML = `<rowan-table></rowan-table>`;
    const table = host.querySelector("rowan-table");
    table.config = {
      ...config,
      rows: config.rows?.map((row) => ({ ...row })),
    };
    return { host, table };
  }

  async function focusCell(table, columnId, rowId) {
    await waitFor(() => table.renderRoot.querySelector(`td[data-column-id="${columnId}"]`));
    const cell = rowId
      ? table.renderRoot.querySelector(`tr[data-row-id="${rowId}"] td[data-column-id="${columnId}"]`)
      : table.renderRoot.querySelector(`td[data-column-id="${columnId}"]`);
    cell.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    return cell;
  }

  const columns = [
    { id: "name", header: "Name", editable: true },
    { id: "note", header: "Note", editable: false },
    {
      id: "score",
      header: "Score",
      type: "number",
      editable: true,
      required: true,
      validate: (value) => value == null || value >= 0 || "Too small",
    },
    {
      id: "role",
      header: "Role",
      type: "select",
      editable: true,
      editor: {
        type: "select",
        options: [
          { value: "admin", label: "Admin" },
          { value: "editor", label: "Editor" },
        ],
      },
    },
    { id: "active", header: "Active", type: "checkbox", editable: true },
    { id: "joined", header: "Joined", type: "date", editable: true },
    { id: "secret", header: "Secret", hidden: true, editable: true },
  ];

  const rows = [
    { id: "p-1", name: "Grace", note: "keep", score: 10, role: "editor", active: false, joined: "2026-01-01", secret: "x" },
    { id: "p-2", name: "Alan", note: "keep", score: 8, role: "admin", active: true, joined: "2026-02-01", secret: "y" },
    { id: "p-3", name: "Radia", note: "keep", score: 9, role: "editor", active: false, joined: "2026-03-01", secret: "z" },
  ];

  it("pastes a block across editable columns and rows, skipping hidden and read-only columns", async () => {
    const { host, table } = mount({ columns, rows, rowId: "id", selectable: "multiple" });
    const commits = [];
    table.addEventListener("rowan-edit-commit", (event) => commits.push(event.detail.columnId));
    await focusCell(table, "name");
    const result = await table.pasteText("Ada\t12\tAdmin\ttrue\t2026-04-02\nKen\t4\tEditor\tno\t2026-05-01\nExtra\nBeyond");
    expect(result.applied.map((item) => `${item.rowId}:${item.columnId}`)).to.deep.equal([
      "p-1:name",
      "p-1:score",
      "p-1:role",
      "p-1:active",
      "p-1:joined",
      "p-2:name",
      "p-2:score",
      "p-2:role",
      "p-2:active",
      "p-2:joined",
      "p-3:name",
    ]);
    expect(table.rows[0]).to.include({
      name: "Ada",
      note: "keep",
      score: 12,
      role: "admin",
      active: true,
      joined: "2026-04-02",
      secret: "x",
    });
    expect(table.rows[1].name).to.equal("Ken");
    expect(table.rows[1].score).to.equal(4);
    expect(table.rows[2].name).to.equal("Extra");
    expect(result.ignored).to.equal(1);
    expect(commits).to.include("score");
    expect(table.renderRoot.textContent).to.include("Ada");
    expect(table.renderRoot.querySelector(".data-status").textContent).to.equal("Pasted 11.");
    document.body.removeChild(host);
  });

  it("rejects invalid values without committing and shows the error", async () => {
    const { host, table } = mount({ columns, rows, rowId: "id" });
    await focusCell(table, "score", "p-1");
    const result = await table.pasteText("nope\n-1");
    expect(table.rows[0].score).to.equal(10);
    expect(table.rows[1].score).to.equal(8);
    expect(result.rejected.map((item) => item.message)).to.deep.equal(["Invalid value", "Too small"]);
    const cell = table.renderRoot.querySelector('tr[data-row-id="p-1"] td[data-column-id="score"]');
    expect(cell.getAttribute("aria-invalid")).to.equal("true");
    expect(cell.querySelector(".cell-editor-error").textContent).to.equal("Invalid value");
    expect(table.renderRoot.querySelector(".data-status").textContent).to.equal("2 not pasted.");
    document.body.removeChild(host);
  });

  it("lets rowan-paste change or cancel the paste, and reports rowan-paste-result", async () => {
    const { host, table } = mount({ columns, rows, rowId: "id" });
    await focusCell(table, "name");
    table.addEventListener("rowan-paste", (event) => {
      event.detail.targets[0].value = "Changed";
    });
    const results = [];
    table.addEventListener("rowan-paste-result", (event) => results.push(event.detail));
    const result = await table.pasteText("Ada");
    expect(result.applied[0].value).to.equal("Changed");
    expect(table.rows[0].name).to.equal("Changed");
    expect(results[0].applied).to.have.length(1);

    table.addEventListener("rowan-paste", (event) => event.preventDefault(), { once: true });
    const blocked = await table.pasteText("Nope");
    expect(blocked.prevented).to.equal(true);
    expect(table.rows[0].name).to.equal("Changed");
    document.body.removeChild(host);
  });

  it("fills selected rows with one value and pastes from the keyboard", async () => {
    const { host, table } = mount({ columns, rows, rowId: "id", selectable: "multiple" });
    table.selected = ["p-1", "p-3"];
    await focusCell(table, "name", "p-1");
    const filled = await table.pasteText("Shared");
    expect(filled.applied.map((item) => item.rowId)).to.deep.equal(["p-1", "p-3"]);
    expect(table.rows[0].name).to.equal("Shared");
    expect(table.rows[1].name).to.equal("Alan");
    expect(table.rows[2].name).to.equal("Shared");

    const clipboard = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { readText: async () => "Keyed" },
    });
    const cell = await focusCell(table, "name", "p-2");
    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "v", ctrlKey: true, bubbles: true }));
    await waitFor(() => table.rows[1].name === "Keyed");
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: clipboard });
    document.body.removeChild(host);
  });

  it("follows column order and stops at the loaded server page", async () => {
    const { host, table } = mount({
      columns: [
        { id: "city", header: "City", editable: true },
        { id: "name", header: "Name", editable: true },
      ],
      rows: [
        { id: "p-1", name: "Grace", city: "London" },
        { id: "p-2", name: "Alan", city: "Manchester" },
      ],
      rowId: "id",
    });
    await focusCell(table, "city");
    await table.pasteText("Paris\tAda");
    expect(table.rows[0]).to.include({ city: "Paris", name: "Ada" });
    document.body.removeChild(host);

    const serverHost = document.createElement("div");
    document.body.appendChild(serverHost);
    serverHost.innerHTML = `<rowan-table data-mode="server"></rowan-table>`;
    const server = serverHost.querySelector("rowan-table");
    const all = [
      { id: "1", name: "One" },
      { id: "2", name: "Two" },
      { id: "3", name: "Three" },
    ];
    server.config = {
      columns: [{ id: "name", header: "Name", editable: true }],
      page: { index: 0, size: 2 },
    };
    server.dataSource = {
      debounce: 0,
      getRows: ({ page, pageSize }) => Promise.resolve({
        rows: all.slice(page * pageSize, page * pageSize + pageSize),
        total: all.length,
      }),
    };
    await waitFor(() => server.renderRoot.textContent.includes("One"));
    await focusCell(server, "name");
    const pasted = await server.pasteText("Uno\nDos\nTres");
    expect(server.renderRoot.textContent).to.include("Uno");
    expect(server.renderRoot.textContent).to.include("Dos");
    expect(server.renderRoot.textContent).to.not.include("Tres");
    expect(pasted.ignored).to.equal(1);
    expect(pasted.applied).to.have.length(2);
    document.body.removeChild(serverHost);
  });

  it("honors rowan-edit-validate cancellation", async () => {
    const { host, table } = mount({ columns, rows, rowId: "id" });
    table.addEventListener("rowan-edit-validate", (event) => {
      if (event.detail.value === "Blocked") event.preventDefault();
    });
    await focusCell(table, "name");
    const result = await table.pasteText("Blocked");
    expect(result.rejected[0].message).to.equal("Invalid value");
    expect(table.rows[0].name).to.equal("Grace");
    document.body.removeChild(host);
  });
});

describe("column menu and multi-sort", () => {
  function mount(config) {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const table = document.createElement("rowan-table");
    host.append(table);
    table.config = {
      rowId: "id",
      columns: [
        { id: "name", header: "Name", sortable: true, filterable: true },
        { id: "score", header: "Score", type: "number", sortable: true },
        { id: "note", header: "Note", hidden: true },
      ],
      rows: [
        { id: "1", name: "Ada", score: 1, note: "kept" },
        { id: "2", name: "Ada", score: 5, note: "kept" },
        { id: "3", name: "Bea", score: 3, note: "kept" },
        { id: "4", name: "Ada", score: 5, note: "kept" },
      ],
      ...config,
    };
    return { host, table };
  }

  function names(table) {
    return [...table.renderRoot.querySelectorAll('td[data-column-id="name"]')].map((cell) => cell.textContent.trim());
  }

  async function openMenu(table, columnId) {
    const button = table.renderRoot.querySelector(`th[data-column-id="${columnId}"] .col-menu`);
    button.click();
    await waitFor(() => table.renderRoot.querySelector(".col-menu-panel"));
    return table.renderRoot.querySelector(".col-menu-panel");
  }

  it("sorts stably by an ordered sort array and reflects the sort attribute", async () => {
    const { host, table } = mount();
    const events = [];
    table.addEventListener("rowan-sort-change", (event) => events.push(event.detail.sort));
    table.sort = [
      { id: "name", dir: "asc" },
      { id: "score", dir: "desc" },
    ];
    await nextMicrotask();
    expect(events).to.deep.equal([]);
    expect(table.sort).to.deep.equal([
      { id: "name", dir: "asc" },
      { id: "score", dir: "desc" },
    ]);
    expect([...table.renderRoot.querySelectorAll("tbody tr")].map((row) => row.dataset.rowId)).to.deep.equal(["2", "4", "1", "3"]);
    expect(table.renderRoot.querySelector('th[data-column-id="name"] .sort-indicator').textContent).to.equal("↑1");
    expect(table.renderRoot.querySelector('th[data-column-id="score"] .sort-indicator').textContent).to.equal("↓2");

    table.setAttribute("sort", JSON.stringify({ id: "score", dir: "asc" }));
    await nextMicrotask();
    expect(table.sort).to.deep.equal({ id: "score", dir: "asc" });
    expect([...table.renderRoot.querySelectorAll("tbody tr")].map((row) => row.dataset.rowId)).to.deep.equal(["1", "3", "2", "4"]);
    document.body.removeChild(host);
  });

  it("adds a sort with Shift+click and reports the full model", async () => {
    const { host, table } = mount();
    const sorts = [];
    const models = [];
    table.addEventListener("rowan-sort", (event) => sorts.push(event.detail));
    table.addEventListener("rowan-sort-change", (event) => models.push(event.detail.sort));
    await nextMicrotask();
    table.renderRoot.querySelector('th[data-column-id="name"] .sort-button').click();
    await nextMicrotask();
    const score = table.renderRoot.querySelector('th[data-column-id="score"] .sort-button');
    score.dispatchEvent(new MouseEvent("click", { bubbles: true, shiftKey: true }));
    await waitFor(() => Array.isArray(table.sort) && table.sort.length === 2);
    expect(sorts.map((item) => item.id)).to.deep.equal(["name", "score"]);
    expect(models.at(-1)).to.deep.equal([
      { id: "name", dir: "asc" },
      { id: "score", dir: "asc" },
    ]);
    expect(names(table)).to.deep.equal(["Ada", "Ada", "Ada", "Bea"]);
    document.body.removeChild(host);
  });

  it("opens an accessible column menu for sort, pin, hide, width, and filter", async () => {
    const { host, table } = mount();
    await nextMicrotask();
    const trigger = table.renderRoot.querySelector('th[data-column-id="name"] .col-menu');
    expect(trigger.getAttribute("aria-haspopup")).to.equal("menu");
    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
    expect(trigger.getAttribute("aria-label")).to.equal("Name column menu");
    trigger.focus();
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await waitFor(() => table.renderRoot.querySelector(".col-menu-panel"));
    const panel = table.renderRoot.querySelector(".col-menu-panel");
    expect(panel.getAttribute("role")).to.equal("menu");
    expect(trigger.getAttribute("aria-expanded")).to.equal("true");
    expect(table.shadowRoot.activeElement?.getAttribute("role")).to.equal("menuitem");
    table.shadowRoot.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(table.shadowRoot.activeElement?.dataset?.action).to.equal("desc");
    table.shadowRoot.activeElement.click();
    await nextMicrotask();
    expect(table.sort).to.deep.equal({ id: "name", dir: "desc" });
    expect(names(table)[0]).to.equal("Bea");

    const pinned = await openMenu(table, "name");
    pinned.querySelector('[data-action="pin-end"]').click();
    await nextMicrotask();
    const headerIds = [...table.renderRoot.querySelectorAll("thead th")].map((cell) => cell.dataset.columnId);
    expect(headerIds.at(-1)).to.equal("name");
    expect(table.renderRoot.querySelector('th[data-column-id="name"]').classList.contains("sticky-end")).to.equal(true);

    const hiding = await openMenu(table, "name");
    hiding.querySelector('[data-action="hide"]').click();
    await nextMicrotask();
    expect(table.renderRoot.querySelector('th[data-column-id="name"]')).to.equal(null);
    const showing = await openMenu(table, "score");
    showing.querySelector('[data-action="show:name"]').click();
    await nextMicrotask();
    expect(table.renderRoot.querySelector('th[data-column-id="name"]')).to.not.equal(null);
    expect(table.renderRoot.querySelector('th[data-column-id="note"]')).to.equal(null);
    const reveal = await openMenu(table, "name");
    reveal.querySelector('[data-action="show:note"]').click();
    await nextMicrotask();
    expect(table.renderRoot.querySelector('th[data-column-id="note"]')).to.not.equal(null);

    const sizing = await openMenu(table, "name");
    sizing.querySelector('[data-action="autosize"]').click();
    await nextMicrotask();
    expect(table.renderRoot.querySelector('th[data-column-id="name"]').style.width).to.match(/px$/);
    const reset = await openMenu(table, "name");
    reset.querySelector('[data-action="reset"]').click();
    await nextMicrotask();
    expect(table.renderRoot.querySelector('th[data-column-id="name"]').style.width).to.equal("");

    const blocked = [];
    table.addEventListener("rowan-column-filter", (event) => {
      blocked.push(event.detail);
      event.preventDefault();
    }, { once: true });
    const filtering = await openMenu(table, "name");
    const input = filtering.querySelector("input");
    expect(input).to.not.equal(null);
    expect(filtering.querySelector('[data-action="asc"]').disabled).to.equal(false);
    input.value = "Bea";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await nextMicrotask();
    expect(blocked[0]).to.deep.equal({ columnId: "name", value: "Bea" });
    expect(table.filters).to.deep.equal([]);
    expect(names(table)).to.have.length(4);

    input.value = "Bea";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await nextMicrotask();
    expect(table.filters).to.deep.equal([{ id: "name", value: "Bea" }]);
    expect(names(table)).to.have.length(4);
    document.body.removeChild(host);
  });

  it("sends an ordered sort array from server mode", async () => {
    const calls = [];
    const host = document.createElement("div");
    document.body.appendChild(host);
    const table = document.createElement("rowan-table");
    table.dataMode = "server";
    host.append(table);
    table.config = {
      columns: [
        { id: "name", header: "Name", sortable: true },
        { id: "city", header: "City", sortable: true },
      ],
      page: { index: 0, size: 5 },
    };
    table.dataSource = {
      debounce: 0,
      getRows(query) {
        calls.push(query.sort);
        return Promise.resolve({ rows: [{ id: "1", name: "Ada", city: "Paris" }], total: 1 });
      },
    };
    await waitFor(() => calls.length >= 1);
    expect(calls.at(-1)).to.equal(null);
    table.sort = [
      { id: "city", dir: "asc" },
      { id: "name", dir: "desc" },
    ];
    await waitFor(() => Array.isArray(calls.at(-1)) && calls.at(-1).length === 2);
    expect(calls.at(-1)).to.deep.equal([
      { id: "city", dir: "asc" },
      { id: "name", dir: "desc" },
    ]);
    table.sort = { id: "name", dir: "asc" };
    await waitFor(() => Array.isArray(calls.at(-1)) && calls.at(-1).length === 1);
    expect(calls.at(-1)).to.deep.equal([{ id: "name", dir: "asc" }]);
    expect(table.sort).to.deep.equal({ id: "name", dir: "asc" });
    document.body.removeChild(host);
  });

  it("keeps a dragged width when columns are replaced and restores the authored width", async () => {
    const { host, table } = mount({
      columns: [
        { id: "name", header: "Name", sortable: true, width: "9rem" },
        { id: "score", header: "Score", type: "number", sortable: true },
        { id: "note", header: "Note" },
      ],
    });
    table.resizableColumns = true;
    await nextMicrotask();
    const handle = table.renderRoot.querySelector('.resize-handle');
    handle.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await waitFor(() => table.renderRoot.querySelector('th[data-column-id="name"]').style.width.endsWith("px"));
    const dragged = table.renderRoot.querySelector('th[data-column-id="name"]').style.width;

    table.columns = table.columns.map((column) => ({ ...column }));
    await nextMicrotask();
    expect(table.renderRoot.querySelector('th[data-column-id="name"]').style.width).to.equal(dragged);
    expect(table.columns[0].width).to.equal("9rem");

    const menu = await openMenu(table, "name");
    menu.querySelector('[data-action="reset"]').click();
    await nextMicrotask();
    expect(table.renderRoot.querySelector('th[data-column-id="name"]').style.width).to.equal("9rem");
    document.body.removeChild(host);
  });

  it("clears one sort key from the column menu", async () => {
    const { host, table } = mount();
    const models = [];
    table.sort = [
      { id: "name", dir: "asc" },
      { id: "score", dir: "desc" },
    ];
    await nextMicrotask();
    table.addEventListener("rowan-sort-change", (event) => models.push(event.detail.sort));
    const menu = await openMenu(table, "name");
    menu.querySelector('[data-action="clear"]').click();
    await nextMicrotask();
    expect(table.sort).to.deep.equal({ id: "score", dir: "desc" });
    expect(models.at(-1)).to.deep.equal([{ id: "score", dir: "desc" }]);
    expect(table.renderRoot.querySelector('th[data-column-id="score"] .sort-indicator').textContent).to.equal("↓");
    document.body.removeChild(host);
  });
});
