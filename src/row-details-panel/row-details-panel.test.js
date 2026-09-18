import { expect } from "@esm-bundle/chai";

import "../table/table.js";
import "./row-details-panel.js";
import { isTopmostOverlay } from "../lib/overlay-stack.js";

const nextMicrotask = () => Promise.resolve();

async function settle() {
  await nextMicrotask();
  await nextMicrotask();
  await nextMicrotask();
  await nextMicrotask();
}

function createTable() {
  const table = document.createElement("rowan-table");
  table.id = "members-table";
  table.config = {
    rowId: "id",
    columns: [
      { id: "name", header: "Name", type: "text" },
      { id: "role", header: "Role", type: "text" },
      { id: "edit", header: "Edit", type: "button" },
    ],
    rows: [{ id: "member-1", name: "Ada", role: "Admin" }],
  };
  return table;
}

describe("rowan-row-details-panel", () => {
  it("sizes the modal overlay and drawer to the viewport", async () => {
    const panel = document.createElement("rowan-row-details-panel");
    document.body.append(panel);
    await settle();

    panel.open = true;
    await settle();

    const overlay = panel.shadowRoot.querySelector("dialog");
    const drawer = panel.shadowRoot.querySelector(".panel");
    const overlayBox = overlay.getBoundingClientRect();
    const drawerBox = drawer.getBoundingClientRect();

    expect(overlayBox.height).to.be.at.least(Math.min(window.innerHeight, 80) * 0.75);
    expect(drawerBox.height).to.be.at.least(Math.min(window.innerHeight, 80) * 0.75);

    panel.remove();
  });

  it("makes background content inert while open", async () => {
    const outside = document.createElement("button");
    document.body.append(outside);

    const panel = document.createElement("rowan-row-details-panel");
    document.body.append(panel);
    await settle();

    panel.open = true;
    await settle();

    const overlay = panel.shadowRoot.querySelector("dialog");
    expect(overlay.matches(":modal")).to.equal(true);

    outside.focus();
    expect(document.activeElement === outside).to.equal(false);

    panel.open = false;
    await settle();

    outside.focus();
    expect(document.activeElement === outside).to.equal(true);

    panel.remove();
    outside.remove();
  });

  it("keeps closed panels out of modal semantics and names open panels", async () => {
    const panel = document.createElement("rowan-row-details-panel");
    panel.label = "Member details";
    document.body.append(panel);
    await settle();

    expect(panel.inert).to.equal(true);
    expect(panel.internals.role).to.equal(null);
    expect(panel.internals.ariaModal).to.equal(null);
    expect(panel.internals.ariaHidden).to.equal("true");

    panel.open = true;
    await settle();

    expect(panel.inert).to.equal(false);
    expect(panel.internals.role).to.equal(null);
    expect(panel.internals.ariaModal).to.equal(null);
    expect(panel.internals.ariaHidden).to.equal("false");
    expect(panel.shadowRoot.querySelector("dialog").getAttribute("aria-label")).to.equal(
      "Member details",
    );
  });

  it("releases the scroll lock when an open panel is removed from the document", async () => {
    const panel = document.createElement("rowan-row-details-panel");
    document.body.append(panel);
    await settle();

    const initialOverflow = document.body.style.overflow;

    panel.open = true;
    await settle();
    expect(document.body.style.overflow).to.equal("hidden");

    panel.remove();

    expect(document.body.style.overflow).to.equal(initialOverflow);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("opens from table row activation and emits rowan-close only for user dismissal", async () => {
    const table = createTable();
    const panel = document.createElement("rowan-row-details-panel");
    panel.forTable = "members-table";

    const closeEvents = [];
    panel.addEventListener("rowan-close", (event) => {
      closeEvents.push(event.detail);
    });

    document.body.append(table, panel);
    await settle();

    const row = table.shadowRoot.querySelector("tbody tr");
    row.dispatchEvent(new MouseEvent("dblclick", { bubbles: true, composed: true }));
    await settle();

    expect(panel.table).to.equal(table);
    expect(panel.open).to.equal(true);
    expect(panel.row).to.equal(table.rows[0]);
    expect(panel.rowId).to.equal("member-1");
    expect(panel.shadowRoot.querySelector("dialog").getAttribute("aria-label")).to.not.equal(null);
    expect(panel.shadowRoot.querySelector('[part="fields"]').textContent).to.contain("Ada");
    expect(panel.shadowRoot.querySelector('[part="fields"]').textContent).to.contain("Admin");

    const closeButton = panel.shadowRoot.querySelector("rowan-icon-button");
    closeButton.shadowRoot.querySelector("button").click();
    await settle();

    expect(panel.open).to.equal(false);
    expect(closeEvents).to.deep.equal([
      {
        reason: "close-button",
        rowId: "member-1",
        row: table.rows[0],
      },
    ]);

    panel.open = true;
    await settle();
    panel.open = false;
    await settle();

    expect(closeEvents).to.have.length(1);
  });

  it("renders property-owned detail fields without emitting an event", async () => {
    const panel = document.createElement("rowan-row-details-panel");
    panel.fields = [
      { id: "name", label: "Member name" },
      { id: "quota", label: "Quota", format: (value) => `${value}%` },
    ];
    panel.row = { id: "member-2", name: "Grace", quota: 72 };
    panel.rowId = "member-2";
    panel.open = true;

    let closeEventCount = 0;
    panel.addEventListener("rowan-close", () => {
      closeEventCount += 1;
    });

    document.body.append(panel);
    await settle();

    const fields = panel.shadowRoot.querySelector('[part="fields"]');
    expect(panel.getAttribute("row-id")).to.equal("member-2");
    expect(fields.textContent).to.contain("Member name");
    expect(fields.textContent).to.contain("Grace");
    expect(fields.textContent).to.contain("72%");
    expect(closeEventCount).to.equal(0);

    panel.row = { id: "member-3", name: "Linus", quota: 18 };
    panel.open = false;
    await settle();

    expect(closeEventCount).to.equal(0);
  });

  it("resolves a controlled rowId from its bound table without an event", async () => {
    const table = createTable();
    const panel = document.createElement("rowan-row-details-panel");
    panel.forTable = "members-table";
    panel.rowId = "member-1";
    panel.open = true;
    let closeEventCount = 0;
    panel.addEventListener("rowan-close", () => {
      closeEventCount += 1;
    });

    document.body.append(table, panel);
    await settle();

    expect(panel.row).to.equal(table.rows[0]);
    expect(panel.shadowRoot.querySelector('[part="fields"]').textContent).to.contain("Ada");
    expect(closeEventCount).to.equal(0);
  });

  it("matches Table rowId functions and refreshes a controlled row after table updates", async () => {
    const table = document.createElement("rowan-table");
    table.id = "function-row-id-table";
    table.config = {
      rowId: (row) => row.key,
      columns: [{ id: "name", header: "Name", type: "text" }],
      rows: [
        { key: "first", name: "Ada" },
        { key: 0, name: "Grace" },
      ],
    };

    const panel = document.createElement("rowan-row-details-panel");
    panel.forTable = "function-row-id-table";
    panel.rowId = "0";
    panel.fields = [{ id: "name", label: "Member name" }];
    panel.open = true;

    document.body.append(table, panel);
    await settle();

    expect(panel.row).to.equal(table.rows[1]);
    expect(panel.shadowRoot.querySelector('[part="fields"]').textContent).to.contain("Grace");

    const refreshedRow = { key: 0, name: "Linus" };
    table.rows = [table.rows[0], refreshedRow];
    await settle();

    expect(panel.row).to.equal(refreshedRow);
    expect(panel.shadowRoot.querySelector('[part="fields"]').textContent).to.contain("Linus");
  });

  it("preserves significant rowId whitespace from a bound table", async () => {
    const table = document.createElement("rowan-table");
    table.id = "whitespace-row-id-table";
    table.config = {
      rowId: (row) => row.key,
      columns: [{ id: "name", header: "Name", type: "text" }],
      rows: [{ key: " member-1 ", name: "Ada" }],
    };

    const panel = document.createElement("rowan-row-details-panel");
    panel.forTable = "whitespace-row-id-table";
    panel.rowId = " member-1 ";
    panel.open = true;

    document.body.append(table, panel);
    await settle();

    expect(panel.getAttribute("row-id")).to.equal(" member-1 ");
    expect(panel.row).to.equal(table.rows[0]);
    expect(panel.shadowRoot.querySelector('[part="fields"]').textContent).to.contain("Ada");
  });

  it("binds a controlled row when a declarative table reference becomes available later", async () => {
    const panel = document.createElement("rowan-row-details-panel");
    panel.forTable = "late-members-table";
    panel.rowId = "member-1";
    panel.open = true;

    document.body.append(panel);
    await settle();

    expect(panel.table).to.equal(null);

    const table = createTable();
    table.id = "late-members-table";
    document.body.append(table);
    await settle();

    expect(panel.table).to.equal(table);
    expect(panel.row).to.equal(table.rows[0]);
    expect(panel.shadowRoot.querySelector('[part="fields"]').textContent).to.contain("Ada");
  });

  it("restores controls and focus containment after reconnecting while open", async () => {
    const outside = document.createElement("button");
    outside.textContent = "Outside";
    document.body.append(outside);

    const panel = document.createElement("rowan-row-details-panel");
    panel.row = { id: "member-1", name: "Ada" };
    panel.rowId = "member-1";
    panel.open = true;
    document.body.append(panel);
    await settle();

    panel.remove();
    await settle();
    expect(isTopmostOverlay(panel)).to.equal(false);

    document.body.append(panel);
    await settle();

    expect(document.body.style.overflow).to.equal("hidden");
    expect(isTopmostOverlay(panel)).to.equal(true);

    outside.focus();
    await settle();

    const closeButton = panel.shadowRoot.querySelector("rowan-icon-button");
    expect(panel.shadowRoot.activeElement).to.equal(closeButton);

    closeButton.shadowRoot.querySelector("button").click();
    await settle();

    expect(panel.open).to.equal(false);
  });
});
