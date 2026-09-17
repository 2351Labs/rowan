import { expect } from "@esm-bundle/chai";

import "../table/table.js";
import { observeTableSelection } from "./table-selection.js";

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
