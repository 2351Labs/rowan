import { expect } from "@esm-bundle/chai";

import { createDashboardFilters } from "./dashboard-filters.js";

describe("createDashboardFilters", () => {
  it("sets, gets, and snapshots a shallow copy", () => {
    const session = createDashboardFilters({ region: "west" });
    expect(session.get("region")).to.equal("west");
    expect(session.snapshot()).to.deep.equal({ region: "west" });

    session.set("yard", "north");
    const first = session.snapshot();
    expect(first).to.deep.equal({ region: "west", yard: "north" });

    first.region = "mutated";
    expect(session.get("region")).to.equal("west");
    expect(session.snapshot()).to.deep.equal({ region: "west", yard: "north" });
  });

  it("clears one key or the whole session", () => {
    const session = createDashboardFilters({ region: "west", yard: "north" });
    session.clear("missing");
    expect(session.snapshot()).to.deep.equal({ region: "west", yard: "north" });

    session.clear("region");
    expect(session.get("region")).to.equal(undefined);
    expect(session.snapshot()).to.deep.equal({ yard: "north" });

    session.clear();
    expect(session.snapshot()).to.deep.equal({});
  });

  it("notifies subscribers and unsubscribes", () => {
    const session = createDashboardFilters();
    const seen = [];
    const stop = session.subscribe((snapshot) => seen.push(snapshot));

    expect(seen).to.deep.equal([]);
    session.set("region", "west");
    session.set("yard", "north");
    session.clear("yard");
    stop();
    session.set("region", "east");

    expect(seen).to.deep.equal([
      { region: "west" },
      { region: "west", yard: "north" },
      { region: "west" },
    ]);
  });

  it("replaces from a snapshot for deep-link round trips", () => {
    const session = createDashboardFilters({ stale: true });
    const seen = [];
    session.subscribe((snapshot) => seen.push(snapshot));

    session.replace({ region: "west", day: "Mon" });
    expect(session.snapshot()).to.deep.equal({ region: "west", day: "Mon" });
    expect(session.get("stale")).to.equal(undefined);

    session.replace(null);
    expect(session.snapshot()).to.deep.equal({});
    expect(seen).to.deep.equal([{ region: "west", day: "Mon" }, {}]);
  });

  it("ignores blank keys and non-object initial values", () => {
    const session = createDashboardFilters(["west"]);
    expect(session.snapshot()).to.deep.equal({});
    session.set("  ", "nope");
    session.set("", "nope");
    expect(session.snapshot()).to.deep.equal({});
  });
});
