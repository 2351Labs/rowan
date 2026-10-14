import { expect } from "@esm-bundle/chai";

import { applyQuickFind } from "./table-quick-find.js";

const ROWS = [
  { id: "1", name: "Ada", score: 12, active: true, meta: { team: "Ops" } },
  { id: "2", name: "Alan", score: 9, active: false, meta: { team: "Platform" } },
];

describe("applyQuickFind", () => {
  it("returns a shallow copy of rows when the query is empty", () => {
    expect(applyQuickFind(ROWS, "")).to.deep.equal(ROWS);
    expect(applyQuickFind(ROWS, "   ")).to.deep.equal(ROWS);
    expect(applyQuickFind(ROWS, null)).to.deep.equal(ROWS);
    expect(applyQuickFind(ROWS, "")).to.not.equal(ROWS);
    expect(applyQuickFind(null, "Ada")).to.deep.equal([]);
  });

  it("matches string, number, and boolean cells case-insensitively", () => {
    expect(applyQuickFind(ROWS, "ADA").map((row) => row.id)).to.deep.equal(["1"]);
    expect(applyQuickFind(ROWS, "12").map((row) => row.id)).to.deep.equal(["1"]);
    expect(applyQuickFind(ROWS, "false").map((row) => row.id)).to.deep.equal(["2"]);
  });

  it("skips nested objects and arrays", () => {
    expect(applyQuickFind(ROWS, "Ops")).to.deep.equal([]);
    expect(applyQuickFind([{ id: "1", tags: ["Ops"] }], "Ops")).to.deep.equal([]);
  });

  it("limits the search to provided keys", () => {
    expect(applyQuickFind(ROWS, "1", ["name"])).to.deep.equal([]);
    expect(applyQuickFind(ROWS, "1", ["id"]).map((row) => row.id)).to.deep.equal(["1"]);
    expect(applyQuickFind(ROWS, "Ada", [])).to.deep.equal([]);
  });

  it("does not clone matching row objects", () => {
    const found = applyQuickFind(ROWS, "Ada");
    expect(found[0]).to.equal(ROWS[0]);
  });
});
