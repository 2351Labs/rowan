import { expect } from "@esm-bundle/chai";
import "./kpi-card.js";

const nextMicrotask = () => Promise.resolve();

async function renderCard(options = {}) {
  const card = document.createElement("rowan-kpi-card");
  if (options.label !== undefined) card.label = options.label;
  if (options.tone !== undefined) card.tone = options.tone;
  if (options.value !== undefined) card.value = options.value;
  if (options.delta !== undefined) card.delta = options.delta;
  if (options.deltaLabel !== undefined) card.deltaLabel = options.deltaLabel;
  if (options.loading !== undefined) card.loading = options.loading;
  if (options.chart) {
    const chart = document.createElement("span");
    chart.slot = "chart";
    chart.textContent = "chart";
    card.append(chart);
  }
  if (options.description) {
    card.append(options.description);
  }
  document.body.append(card);
  await nextMicrotask();
  await nextMicrotask();
  return card;
}

describe("rowan-kpi-card", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("keeps an accessible name when only tone is set", async () => {
    const card = await renderCard({ tone: "danger" });

    expect(card.internals.role).to.equal("group");
    expect(card.internals.ariaLabel).to.equal("KPI");
    expect(card.shadowRoot.querySelector("[part='label']").textContent).to.equal("");
  });

  it("renders signed delta text for positive, zero, and negative values and hides null", async () => {
    const card = await renderCard({
      label: "Open incidents",
      value: 128,
      delta: -4,
      deltaLabel: "vs last week",
    });

    expect(card.hasAttribute("value")).to.equal(false);
    expect(card.hasAttribute("delta")).to.equal(false);
    expect(card.shadowRoot.querySelector("[part='value']").textContent).to.equal("128");
    expect(card.shadowRoot.querySelector("[part='delta']").textContent).to.equal("-4 vs last week");

    card.delta = 0;
    await nextMicrotask();
    expect(card.shadowRoot.querySelector("[part='delta']").textContent).to.equal("0 vs last week");

    card.delta = 3;
    await nextMicrotask();
    expect(card.shadowRoot.querySelector("[part='delta']").textContent).to.equal("+3 vs last week");

    card.delta = null;
    await nextMicrotask();
    expect(card.shadowRoot.querySelector("[part='delta']").hidden).to.equal(true);
  });

  it("keeps label and value before a slotted chart in reading order", async () => {
    const card = await renderCard({
      label: "Open incidents",
      value: 12,
      chart: true,
    });

    const parts = [...card.shadowRoot.querySelectorAll("[part]")].map((node) =>
      node.getAttribute("part"),
    );
    expect(parts.indexOf("label")).to.be.below(parts.indexOf("value"));
    expect(parts.indexOf("value")).to.be.below(parts.indexOf("chart"));
    expect(card.shadowRoot.querySelector("[part='chart']").hidden).to.equal(false);
  });

  it("shows an accessible empty value and a loading skeleton", async () => {
    const card = await renderCard({ label: "Open incidents", value: null });

    expect(card.shadowRoot.querySelector("[part='value']").textContent).to.equal("No data");
    expect(card.internals.ariaLabel).to.equal("Open incidents");

    card.loading = true;
    await nextMicrotask();

    expect(card.shadowRoot.querySelector(".skeleton")).to.not.equal(null);
    expect(card.shadowRoot.querySelector("[part='label']").textContent).to.equal("Open incidents");
    if ("ariaBusy" in card.internals) {
      expect(String(card.internals.ariaBusy)).to.equal("true");
    }
  });
});
