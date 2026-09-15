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

  it("stacks offsets from mixed measured and estimated sizes", () => {
    const collection = new VirtualCollection();
    collection.itemKey = "id";
    collection.estimatedItemSize = 20;
    collection.items = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];

    collection.setMeasuredSize("b", 100);
    collection.setMeasuredSize("d", 60);

    expect(collection.entries.map((entry) => entry.offset)).to.deep.equal([0, 20, 120, 140]);
    expect(collection.totalSize).to.equal(200);
  });

  it("reflows offsets after a row is remeasured", () => {
    const collection = new VirtualCollection();
    collection.itemKey = "id";
    collection.estimatedItemSize = 20;
    collection.items = [{ id: "a" }, { id: "b" }, { id: "c" }];

    expect(collection.entries.map((entry) => entry.offset)).to.deep.equal([0, 20, 40]);

    expect(collection.setMeasuredSize("a", 90)).to.equal(true);
    expect(collection.entries.map((entry) => entry.offset)).to.deep.equal([0, 90, 110]);
    expect(collection.totalSize).to.equal(130);

    // Re-measuring to the same value must not invalidate the layout.
    expect(collection.setMeasuredSize("a", 90)).to.equal(false);
  });

  it("resolves the visible window against variable heights, not an average", () => {
    const collection = new VirtualCollection();
    collection.itemKey = "id";
    collection.estimatedItemSize = 20;
    collection.items = Array.from({ length: 6 }, (_, index) => ({ id: `r${index}` }));

    collection.setMeasuredSize("r0", 200);
    collection.setMeasuredSize("r1", 200);

    // Offsets: r0 0, r1 200, r2 400, r3 420, r4 440, r5 460.
    // An average-size estimate would put offset 410 near the end; real offsets put it at r2.
    const range = collection.range(410, 40, 0);
    expect(range.entries.map((entry) => entry.key)).to.deep.equal(["r2", "r3", "r4"]);
    expect(range.totalSize).to.equal(480);

    const first = range.entries[0];
    const last = range.entries.at(-1);
    expect(first.offset).to.be.at.most(410);
    expect(last.offset + last.size).to.be.at.least(450);
  });

  it("drops measurements for rows that leave the collection", () => {
    const collection = new VirtualCollection();
    collection.itemKey = "id";
    collection.estimatedItemSize = 20;
    collection.items = [{ id: "a" }, { id: "b" }];
    collection.setMeasuredSize("b", 75);

    expect(collection.entries.map((entry) => entry.size)).to.deep.equal([20, 75]);

    collection.items = [{ id: "a" }];
    expect(collection.entries.map((entry) => entry.size)).to.deep.equal([20]);

    // "b" returning must not inherit its stale measurement.
    collection.items = [{ id: "a" }, { id: "b" }];
    expect(collection.entries.map((entry) => entry.size)).to.deep.equal([20, 20]);
  });
});
