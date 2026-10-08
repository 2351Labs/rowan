import { expect } from "@esm-bundle/chai";

import {
  TABLE_VIEW_STATE_VERSION,
  mergeTableViewState,
  normalizeTableViewState,
  restoreTableViewState,
  serializeTableViewState,
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

  it("round-trips experimental filter groups as version 2", () => {
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
});
