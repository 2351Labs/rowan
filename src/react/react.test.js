import { expect } from "@esm-bundle/chai";
import { act, createElement, useEffect, useRef } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import "../table/table.js";
import { useRowanElement } from "./index.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const wait = () => Promise.resolve();

function createConfig() {
  return {
    columns: [{ id: "name", header: "Name" }],
    rows: [{ id: "1", name: "Ada" }],
  };
}

function TableHarness({ elementKey, events, properties }) {
  const ref = useRef(null);
  useRowanElement(ref, {
    properties,
    events,
  });

  return createElement("rowan-table", { ref, key: elementKey, caption: "Members" });
}

function ClientRegistrationHarness({ onRegistered }) {
  useEffect(() => {
    void import("../status-indicator/status-indicator.js").then(onRegistered);
  }, [onRegistered]);

  return createElement("rowan-status-indicator", { label: "Connected" });
}

describe("@rowan-ui/core/react", () => {
  const roots = [];

  afterEach(async () => {
    for (const root of roots.splice(0)) {
      await act(async () => root.unmount());
    }

    document.body.innerHTML = "";
  });

  it("assigns property-only state and replaces native custom-event listeners", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    roots.push(root);

    const firstEvents = [];
    const secondEvents = [];
    const config = createConfig();
    const properties = { config };

    await act(async () => {
      root.render(
        createElement(TableHarness, {
          events: { "rowan-select": (event) => firstEvents.push(event) },
          properties,
        }),
      );
    });
    await wait();

    const table = container.querySelector("rowan-table");
    expect(table.config.rows).to.deep.equal(config.rows);

    table.dispatchEvent(new CustomEvent("rowan-select", { detail: { selected: ["1"] } }));
    expect(firstEvents).to.have.length(1);

    await act(async () => {
      root.render(
        createElement(TableHarness, {
          events: { "rowan-select": (event) => secondEvents.push(event) },
          properties,
        }),
      );
    });

    table.dispatchEvent(new CustomEvent("rowan-select", { detail: { selected: ["1"] } }));
    expect(firstEvents).to.have.length(1);
    expect(secondEvents).to.have.length(1);

    await act(async () => root.unmount());
    roots.pop();
    table.dispatchEvent(new CustomEvent("rowan-select", { detail: { selected: ["1"] } }));
    expect(secondEvents).to.have.length(1);
  });

  it("rebinds stable properties and listeners when React replaces the host", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    roots.push(root);

    const events = [];
    const properties = { config: createConfig() };
    const listeners = { "rowan-select": (event) => events.push(event) };

    await act(async () => {
      root.render(
        createElement(TableHarness, { elementKey: "first", events: listeners, properties }),
      );
    });

    const firstTable = container.querySelector("rowan-table");

    await act(async () => {
      root.render(
        createElement(TableHarness, { elementKey: "second", events: listeners, properties }),
      );
    });

    const secondTable = container.querySelector("rowan-table");
    expect(secondTable).to.not.equal(firstTable);
    expect(secondTable.config.rows).to.deep.equal(properties.config.rows);

    firstTable.dispatchEvent(new CustomEvent("rowan-select"));
    secondTable.dispatchEvent(new CustomEvent("rowan-select"));
    expect(events).to.have.length(1);
  });

  it("allows client-only registration after React hydration", async () => {
    expect(customElements.get("rowan-status-indicator")).to.equal(undefined);

    const container = document.createElement("div");
    container.innerHTML = '<rowan-status-indicator label="Connected"></rowan-status-indicator>';
    document.body.append(container);

    let register;
    const registered = new Promise((resolve) => {
      register = resolve;
    });
    const root = hydrateRoot(
      container,
      createElement(ClientRegistrationHarness, { onRegistered: register }),
    );
    roots.push(root);

    await registered;
    await wait();

    const indicator = container.querySelector("rowan-status-indicator");
    expect(customElements.get("rowan-status-indicator")).to.not.equal(undefined);
    expect(indicator.constructor.name).to.equal("RowanStatusIndicator");
  });

  it("does not reassign unchanged properties on re-render", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    roots.push(root);

    const properties = { config: createConfig() };

    await act(async () => {
      root.render(createElement(TableHarness, { properties }));
    });
    await wait();

    const table = container.querySelector("rowan-table");
    let assignments = 0;
    const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(table), "config");
    Object.defineProperty(table, "config", {
      configurable: true,
      get: () => descriptor.get.call(table),
      set: (value) => {
        assignments += 1;
        descriptor.set.call(table, value);
      },
    });

    await act(async () => {
      root.render(createElement(TableHarness, { properties }));
    });
    await wait();

    expect(assignments).to.equal(0);

    await act(async () => {
      root.render(createElement(TableHarness, { properties: { config: createConfig() } }));
    });
    await wait();

    expect(assignments).to.equal(1);
  });
});
