import { expect } from "@esm-bundle/chai";

import "../table/table.js";
import { observeTableColumns, observeTableSelection } from "./table-selection.js";

const nextMicrotask = () => Promise.resolve();

describe("observeTableSelection", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("notifies on selected assignment and rowan-select, not shadow mutations", async () => {
    const table = document.createElement("rowan-table");
    table.config = {
      rowId: "id",
      selectable: "multiple",
      columns: [{ id: "name", header: "Name", type: "text" }],
      rows: [
        { id: "order-1", name: "Maple" },
        { id: "order-2", name: "Cedar" },
      ],
    };
    document.body.append(table);
    await nextMicrotask();
    await nextMicrotask();

    let count = 0;
    const stop = observeTableSelection(table, () => {
      count += 1;
    });

    table.shadowRoot.querySelector("tbody").append(document.createElement("tr"));
    await nextMicrotask();
    await nextMicrotask();
    expect(count).to.equal(0);

    table.selected = ["order-1"];
    await nextMicrotask();
    expect(count).to.equal(1);

    table.dispatchEvent(
      new CustomEvent("rowan-select", {
        bubbles: true,
        composed: true,
        detail: { selected: ["order-1"] },
      }),
    );
    expect(count).to.equal(2);

    stop();
  });
});

describe("observeTableColumns", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("notifies when columns are replaced, not when a column object is mutated", async () => {
    const table = document.createElement("rowan-table");
    table.columns = [{ id: "name", header: "Name" }];
    document.body.append(table);
    await nextMicrotask();

    let count = 0;
    const stop = observeTableColumns(table, () => {
      count += 1;
    });

    table.shadowRoot.append(document.createElement("span"));
    await nextMicrotask();
    expect(count).to.equal(0);

    table.columns = [
      { id: "name", header: "Name" },
      { id: "team", header: "Team", hidden: true },
    ];
    expect(count).to.equal(1);

    table.columns[1].hidden = false;
    expect(count).to.equal(1);

    table.columns = table.columns.map((column) =>
      column.id === "team" ? { ...column, hidden: false } : column,
    );
    expect(count).to.equal(2);

    stop();
    table.columns = [];
    expect(count).to.equal(2);
  });

  it("notifies when an own columns property is applied through the setter", () => {
    const table = document.createElement("rowan-table");
    let count = 0;
    const stop = observeTableColumns(table, () => {
      count += 1;
    });

    Object.defineProperty(table, "columns", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: [{ id: "name", header: "Name" }],
    });
    expect(count).to.equal(0);

    const value = table.columns;
    delete table.columns;
    table.columns = [...value, { id: "team", header: "Team" }];
    expect(count).to.equal(1);
    expect(table.columns.map((column) => column.id)).to.deep.equal(["name", "team"]);
    stop();
  });
});
