import { expect } from "@esm-bundle/chai";

import { applyFilters, cloneFilterNode, isFilterGroup } from "./apply-filters.js";

const rows = [
  { id: "1", name: "Ada", age: 36, role: "Admin", joined: "2020-01-15", active: true },
  { id: "2", name: "Alan", age: 41, role: "Editor", joined: "2018-06-02", active: false },
  { id: "3", name: "Grace", age: 29, role: "Viewer", joined: "2024-03-01", active: true },
];

const fields = [
  { id: "name", type: "text" },
  { id: "age", type: "number" },
  { id: "role", type: "select" },
  { id: "joined", type: "date" },
  { id: "active", type: "boolean" },
];

describe("applyFilters", () => {
  it("returns all rows when the filter list is empty", () => {
    expect(applyFilters(rows, [])).to.deep.equal(rows);
    expect(applyFilters(rows, null)).to.deep.equal(rows);
  });

  it("applies a flat AND list with the frozen operators", () => {
    expect(
      applyFilters(rows, [{ field: "name", operator: "contains", value: "a" }], fields).map(
        (row) => row.id,
      ),
    ).to.deep.equal(["1", "2", "3"]);

    expect(
      applyFilters(rows, [{ field: "name", operator: "starts-with", value: "Al" }], fields).map(
        (row) => row.id,
      ),
    ).to.deep.equal(["2"]);

    expect(
      applyFilters(
        rows,
        [
          { field: "age", operator: "greater-than", value: "30" },
          { field: "role", operator: "equals", value: "Admin" },
        ],
        fields,
      ).map((row) => row.id),
    ).to.deep.equal(["1"]);
  });

  it("treats is-empty and unknown operators as documented", () => {
    const withEmpty = [...rows, { id: "4", name: "", age: null, role: null }];
    expect(
      applyFilters(withEmpty, [{ field: "name", operator: "is-empty" }], fields).map(
        (row) => row.id,
      ),
    ).to.deep.equal(["4"]);

    expect(
      applyFilters(rows, [{ field: "name", operator: "matches", value: "Ada" }], fields),
    ).to.deep.equal([]);
  });

  it("applies experimental OR groups inside the frozen top-level AND list", () => {
    expect(
      applyFilters(
        rows,
        [
          {
            join: "or",
            filters: [
              { field: "role", operator: "equals", value: "Admin" },
              { field: "role", operator: "equals", value: "Editor" },
            ],
          },
          { field: "active", operator: "equals", value: "true" },
        ],
        fields,
      ).map((row) => row.id),
    ).to.deep.equal(["1"]);
  });

  it("treats empty AND groups as match-all and empty OR groups as match-none", () => {
    expect(applyFilters(rows, [{ join: "and", filters: [] }], fields)).to.deep.equal(rows);
    expect(applyFilters(rows, [{ join: "or", filters: [] }], fields)).to.deep.equal([]);
  });

  it("keeps a leaf with field even when it also has a filters array", () => {
    expect(
      applyFilters(
        rows,
        [{ field: "name", operator: "equals", value: "Ada", filters: [{ field: "role" }] }],
        fields,
      ).map((row) => row.id),
    ).to.deep.equal(["1"]);
  });

  it("treats unofficial combinator objects without join as leaves, not groups", () => {
    expect(
      isFilterGroup({
        combinator: "or",
        filters: [{ field: "role", operator: "equals", value: "Admin" }],
      }),
    ).to.equal(false);
    expect(
      isFilterGroup({
        join: "or",
        filters: [{ field: "role", operator: "equals", value: "Admin" }],
      }),
    ).to.equal(true);
  });

  it("clones groups without sharing child arrays", () => {
    const group = {
      id: "status",
      join: "or",
      filters: [{ field: "role", operator: "equals", value: "Admin" }],
    };
    const clone = cloneFilterNode(group);
    clone.filters.push({ field: "role", operator: "equals", value: "Editor" });
    expect(group.filters).to.have.length(1);
    expect(clone.filters).to.have.length(2);
  });
});
