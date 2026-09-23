import { expect } from "@esm-bundle/chai";
import "./source-meta.js";
import "../kpi-card/kpi-card.js";
import "../bar-chart/bar-chart.js";
import "../table/table.js";

const nextMicrotask = () => Promise.resolve();

async function renderMeta(options = {}) {
  const el = document.createElement("rowan-source-meta");
  if (options.source != null) el.source = options.source;
  if (options.asOf != null) el.asOf = options.asOf;
  if (options.sourceSlot) {
    const node = document.createElement("span");
    node.slot = "source";
    node.textContent = options.sourceSlot;
    el.append(node);
  }
  if (options.asOfSlot) {
    const node = document.createElement("span");
    node.slot = "as-of";
    node.textContent = options.asOfSlot;
    el.append(node);
  }
  document.body.append(el);
  await nextMicrotask();
  await nextMicrotask();
  return el;
}

describe("rowan-source-meta", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders source and as-of from attributes", async () => {
    const el = await renderMeta({ source: "Warehouse events", asOf: "2026-09-23 14:02 UTC" });

    expect(el.source).to.equal("Warehouse events");
    expect(el.asOf).to.equal("2026-09-23 14:02 UTC");
    expect(el.getAttribute("as-of")).to.equal("2026-09-23 14:02 UTC");
    expect(el.shadowRoot.querySelector(".source").hidden).to.equal(false);
    expect(el.shadowRoot.querySelector(".as-of").hidden).to.equal(false);
    expect(el.shadowRoot.querySelector(".source-fallback").textContent).to.equal(
      "Warehouse events",
    );
    expect(el.shadowRoot.querySelector(".as-of-fallback").textContent).to.equal(
      "2026-09-23 14:02 UTC",
    );
    expect(el.shadowRoot.querySelector(".term").textContent).to.equal("As of");
  });

  it("hides empty pieces and prefers slotted copy", async () => {
    const el = await renderMeta({ source: "Ignored source", asOf: "Ignored as-of" });
    expect(el.shadowRoot.querySelector(".source").hidden).to.equal(false);

    el.source = "";
    el.asOf = "";
    await nextMicrotask();
    expect(el.hasAttribute("source")).to.equal(false);
    expect(el.hasAttribute("as-of")).to.equal(false);
    expect(el.shadowRoot.querySelector(".source").hidden).to.equal(true);
    expect(el.shadowRoot.querySelector(".as-of").hidden).to.equal(true);

    const slotted = await renderMeta({
      source: "Attribute source",
      asOf: "Attribute as-of",
      sourceSlot: "Slotted warehouse",
      asOfSlot: "Slotted time",
    });
    expect(slotted.shadowRoot.querySelector(".source-fallback").hidden).to.equal(true);
    expect(slotted.shadowRoot.querySelector(".as-of-fallback").hidden).to.equal(true);
    expect(
      slotted.shadowRoot.querySelector('slot[name="source"]').assignedElements()[0].textContent,
    ).to.equal("Slotted warehouse");
    expect(
      slotted.shadowRoot.querySelector('slot[name="as-of"]').assignedElements()[0].textContent,
    ).to.equal("Slotted time");
  });

  it("drops into KPI description, chart description, and table caption", async () => {
    const meta = () => {
      const el = document.createElement("rowan-source-meta");
      el.source = "Warehouse events";
      el.asOf = "2026-09-23 14:02 UTC";
      return el;
    };

    const kpi = document.createElement("rowan-kpi-card");
    kpi.label = "Fill rate";
    kpi.value = 82;
    kpi.append(meta());

    const chart = document.createElement("rowan-bar-chart");
    chart.label = "Fill rate";
    const chartMeta = meta();
    chartMeta.slot = "description";
    chart.append(chartMeta);

    const table = document.createElement("rowan-table");
    table.config = {
      columns: [{ id: "name", header: "Name" }],
      rows: [{ id: "1", name: "Ada" }],
    };
    const tableMeta = meta();
    tableMeta.slot = "caption";
    table.append(tableMeta);

    document.body.append(kpi, chart, table);
    await nextMicrotask();
    await nextMicrotask();

    expect(kpi.shadowRoot.querySelector(".description").hidden).to.equal(false);
    expect(kpi.querySelector("rowan-source-meta").source).to.equal("Warehouse events");
    expect(
      chart.shadowRoot.querySelector('slot[name="description"]').assignedElements()[0].tagName,
    ).to.equal("ROWAN-SOURCE-META");
    expect(table.shadowRoot.querySelector("caption").hidden).to.equal(false);
    expect(
      table.shadowRoot.querySelector('slot[name="caption"]').assignedElements()[0].tagName,
    ).to.equal("ROWAN-SOURCE-META");
  });
});
