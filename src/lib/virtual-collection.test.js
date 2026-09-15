import { expect } from "@esm-bundle/chai";

import { VirtualCollection } from "./virtual-collection.js";

describe("VirtualCollection", () => {
  it("assigns collision-proof keys and retains measurements by generated key", () => {
    const collection = new VirtualCollection();
    collection.itemKey = "id";
    collection.estimatedItemSize = 20;
    collection.items = [{ id: "row" }, { id: "row" }, { id: "row--1" }, { id: "row" }];

    const entries = collection.entries;
    expect(entries.map((entry) => entry.key)).to.deep.equal([
      "row",
      "row--1",
      "row--1--1",
      "row--2",
    ]);
    expect(new Set(entries.map((entry) => entry.key)).size).to.equal(entries.length);

    collection.setMeasuredSize("row--1", 36);
    collection.setMeasuredSize("row--1--1", 52);
    collection.items = [...collection.items];

    expect(collection.entries.map((entry) => entry.size)).to.deep.equal([20, 36, 52, 20]);
  });
});
