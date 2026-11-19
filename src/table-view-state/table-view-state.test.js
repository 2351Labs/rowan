import { expect } from "@esm-bundle/chai";

import {
  TABLE_VIEW_STATE_VERSION,
  mergeTableViewState,
  normalizeTableViewState,
  readTableViewStateSearch,
  restoreTableViewState,
  serializeTableViewState,
  writeTableViewStateSearch,
} from "./table-view-state.js";

describe("table view state", () => {
  it("normalizes a property-only state into a JSON-safe plain object", () => {
    const state = normalizeTableViewState({
      sort: { id: " updated ", dir: "desc" },
      page: { index: "2.8", size: "25", total: "103" },
      filters: [
        { id: "owner", field: "owner", operator: "equals", value: "Platform" },
        { field: "status", operator: "equals", value: 42 },
        { field: "", operator: "equals", value: "ignored" },
      ],
      visibleColumns: ["status", "owner", "status", "  "],
      density: "lg",
      groupBy: { id: "service", subtotals: 1, collapsed: 0 },
    });

    expect(Object.getPrototypeOf(state)).to.equal(Object.prototype);
    expect(state).to.deep.equal({
      version: TABLE_VIEW_STATE_VERSION,
      sort: { id: "updated", dir: "desc" },
      page: { index: 2, size: 25, total: 103 },
      filters: [
        { id: "owner", field: "owner", operator: "equals", value: "Platform" },
        { field: "status", operator: "equals", value: "42" },
      ],
      visibleColumns: ["owner", "status"],
      columnWidths: null,
      columnOrder: null,
      density: "lg",
      groupBy: { id: "service", subtotals: true, collapsed: false },
    });
  });

  it("merges explicit patches without mutating a base saved view", () => {
    const base = normalizeTableViewState({
      sort: { id: "name", dir: "asc" },
      page: { index: 3, size: 20 },
      filters: [{ field: "status", operator: "equals", value: "Open" }],
      visibleColumns: ["name", "status"],
      density: "sm",
      groupBy: "team",
    });
    const merged = mergeTableViewState(base, {
      page: { index: 0, size: 50 },
      filters: [],
      density: "lg",
    });

    expect(merged).to.deep.equal({
      version: TABLE_VIEW_STATE_VERSION,
      sort: { id: "name", dir: "asc" },
      page: { index: 0, size: 50 },
      filters: [],
      visibleColumns: ["name", "status"],
      columnWidths: null,
      columnOrder: null,
      density: "lg",
      groupBy: { id: "team", subtotals: false, collapsed: false },
    });
    expect(base.page).to.deep.equal({ index: 3, size: 20 });
    expect(base.filters).to.deep.equal([{ field: "status", operator: "equals", value: "Open" }]);
  });

  it("serializes deterministically and restores URL-safe snapshots", () => {
    const input = {
      density: "sm",
      visibleColumns: ["owner", "name"],
      filters: [{ field: "name", operator: "contains", value: "Mina & Lee" }],
      page: { index: 1, size: 25 },
    };
    const snapshot = serializeTableViewState(input);

    expect(snapshot).to.equal(serializeTableViewState(input));
    expect(snapshot).to.not.include("&");
    expect(snapshot).to.not.include("?");
    expect(restoreTableViewState(snapshot)).to.deep.equal(normalizeTableViewState(input));
  });

  it("returns the default state for malformed snapshots", () => {
    expect(restoreTableViewState("%not-json")).to.deep.equal(normalizeTableViewState());
  });

  it("keeps one sort key as an object and several keys in order", () => {
    expect(normalizeTableViewState({ sort: [{ id: "city", dir: "asc" }] }).sort).to.deep.equal({
      id: "city",
      dir: "asc",
    });

    const sort = [
      { id: " city ", dir: "asc" },
      { id: "name", dir: "desc" },
      { id: "city", dir: "desc" },
      { id: "role", dir: "sideways" },
    ];
    const state = normalizeTableViewState({ sort });
    expect(state.sort).to.deep.equal([
      { id: "city", dir: "asc" },
      { id: "name", dir: "desc" },
    ]);
    expect(restoreTableViewState(serializeTableViewState({ sort }))).to.deep.equal(state);
  });

  it("round-trips nested filter groups as version 2", () => {
    const input = {
      filters: [
        {
          id: "status-group",
          join: "or",
          filters: [
            { field: "status", operator: "equals", value: "open" },
            { field: "status", operator: "equals", value: "pending" },
          ],
        },
      ],
    };
    const state = normalizeTableViewState(input);
    expect(state.version).to.equal(2);
    expect(state.filters).to.deep.equal([
      {
        id: "status-group",
        join: "or",
        filters: [
          { field: "status", operator: "equals", value: "open" },
          { field: "status", operator: "equals", value: "pending" },
        ],
      },
    ]);
    expect(restoreTableViewState(serializeTableViewState(input))).to.deep.equal(state);
  });

  it("migrates a version 1 snapshot to version 2", () => {
    const legacy = {
      version: 1,
      sort: { id: "owner", dir: "asc" },
      filters: [{ field: "status", operator: "equals", value: "Open" }],
      density: "sm",
    };
    const restored = restoreTableViewState(legacy);
    expect(restored.version).to.equal(2);
    expect(restored.sort).to.deep.equal({ id: "owner", dir: "asc" });
    expect(restored.filters).to.deep.equal([
      { field: "status", operator: "equals", value: "Open" },
    ]);
    expect(restoreTableViewState(encodeURIComponent(JSON.stringify(legacy)))).to.deep.equal(
      restored,
    );
  });

  it("rejects unknown versions and malformed input", () => {
    const empty = normalizeTableViewState();
    expect(restoreTableViewState({ version: 3, sort: { id: "city", dir: "asc" } })).to.deep.equal(
      empty,
    );
    expect(restoreTableViewState({ version: "2", density: "lg" })).to.deep.equal(empty);
    expect(restoreTableViewState("%")).to.deep.equal(empty);
    expect(restoreTableViewState("{")).to.deep.equal(empty);
    expect(restoreTableViewState(null)).to.deep.equal(empty);
    expect(
      normalizeTableViewState({ filters: [{ join: "xor", filters: [] }, null, "bad"] }).filters,
    ).to.deep.equal([]);
  });

  it("round-trips a shared query string, including a percent in a filter value", () => {
    const state = normalizeTableViewState({
      filters: [{ field: "name", operator: "contains", value: "100%" }],
      sort: [
        { id: "name", dir: "asc" },
        { id: "city", dir: "desc" },
      ],
    });
    const search = writeTableViewStateSearch(state, { search: "?tab=orders" });
    expect(search.startsWith("?")).to.equal(true);
    expect(search).to.include("tab=orders");
    const read = readTableViewStateSearch(search);
    expect(read.ok).to.equal(true);
    expect(read.state).to.deep.equal(state);
    expect(readTableViewStateSearch("?view=%7Bnot-json").ok).to.equal(false);
    expect(readTableViewStateSearch("").ok).to.equal(false);
  });

  it("drops filter groups beyond the stable depth when normalizing", () => {
    let node = { field: "status", operator: "equals", value: "open" };
    for (let depth = 0; depth < 6; depth += 1) node = { join: "and", filters: [node] };
    const state = normalizeTableViewState({ version: 2, filters: [node] });
    const depthOf = (group) =>
      group.filters?.some((child) => child.join)
        ? 1 + depthOf(group.filters.find((child) => child.join))
        : 1;
    expect(state.version).to.equal(TABLE_VIEW_STATE_VERSION);
    expect(depthOf(state.filters[0])).to.equal(4);
  });
});
