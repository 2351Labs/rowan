import { expect } from "@esm-bundle/chai";
import { reconnectHost } from "../../test/host-lifecycle.js";
import "../gauge-chart/gauge-chart.js";
import "./kpi-card.js";

const nextMicrotask = () => Promise.resolve();
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

async function waitForCardStyles(card) {
  const stylesheet = card.shadowRoot.querySelector('link[rel="stylesheet"]');
  if (!stylesheet) return;

  const hasLoadedRules = () => {
    try {
      return Boolean(stylesheet.sheet?.cssRules.length);
    } catch (_error) {
      return false;
    }
  };

  for (let frame = 0; frame < 60; frame += 1) {
    if (hasLoadedRules()) return;
    await nextFrame();
  }

  throw new Error("KPI card styles did not apply within 60 animation frames.");
}

async function renderCard(options = {}) {
  const card = document.createElement("rowan-kpi-card");
  if (options.label !== undefined) card.label = options.label;
  if (options.tone !== undefined) card.tone = options.tone;
  if (options.value !== undefined) card.value = options.value;
  if (options.delta !== undefined) card.delta = options.delta;
  if (options.deltaLabel !== undefined) card.deltaLabel = options.deltaLabel;
  if (options.loading !== undefined) card.loading = options.loading;
  if (options.gauge) {
    const gauge = document.createElement("rowan-gauge-chart");
    gauge.slot = "chart";
    gauge.label = "Utilization versus target";
    gauge.min = 0;
    gauge.max = 100;
    gauge.value = 72;
    card.append(gauge);
  } else if (options.chart) {
    const chart = document.createElement("span");
    chart.slot = "chart";
    chart.textContent = "chart";
    card.append(chart);
  }
  if (options.description) {
    const copy = document.createElement("span");
    copy.textContent = options.description;
    card.append(copy);
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

  it("keeps slotted chart updates after reconnecting", async () => {
    const card = await renderCard({
      label: "Open incidents",
      value: 12,
    });
    expect(card.shadowRoot.querySelector("[part='chart']").hidden).to.equal(true);

    await reconnectHost(card);
    const chart = document.createElement("span");
    chart.slot = "chart";
    chart.textContent = "chart";
    card.append(chart);
    await nextMicrotask();
    await nextMicrotask();

    expect(card.shadowRoot.querySelector("[part='chart']").hidden).to.equal(false);
    expect(card.shadowRoot.querySelector("[part='value']").textContent).to.equal("12");
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

  it("uses inherited locale and property-only messages for generated KPI copy", async () => {
    const wrapper = document.createElement("div");
    wrapper.lang = "de-DE";
    const card = document.createElement("rowan-kpi-card");
    card.value = 1234.5;
    card.delta = 3.5;
    card.deltaLabel = "gegenueber Plan";
    wrapper.append(card);
    document.body.append(wrapper);
    await nextMicrotask();
    await nextMicrotask();

    card.messages = {
      deltaWithLabel: "{label}: {value}",
      kpi: "Kennzahl",
      noData: "Keine Daten",
    };
    await nextMicrotask();

    const number = new Intl.NumberFormat("de-DE");
    const signedNumber = new Intl.NumberFormat("de-DE", { signDisplay: "exceptZero" });
    expect(card.getAttribute("messages")).to.equal(null);
    expect(card.locale).to.equal("de-DE");
    expect(card.shadowRoot.querySelector('[part="value"]').textContent).to.equal(
      number.format(1234.5),
    );
    expect(card.shadowRoot.querySelector('[part="delta"]').textContent).to.equal(
      `gegenueber Plan: ${signedNumber.format(3.5)}`,
    );
    expect(card.internals.ariaLabel).to.equal("Kennzahl");

    card.value = null;
    await nextMicrotask();

    expect(card.shadowRoot.querySelector('[part="value"]').textContent).to.equal("Keine Daten");
  });

  it("scales padding and slotted chart height with inline size, without hiding the chart", async () => {
    const compact = await renderCard({
      label: "Open incidents",
      value: 12,
      delta: -4,
      deltaLabel: "vs last week",
      description: "Unacknowledged incidents in the current window.",
      chart: true,
    });
    compact.style.inlineSize = "8rem";
    const roomy = await renderCard({
      label: "Open incidents",
      value: 12,
      delta: -4,
      deltaLabel: "vs last week",
      chart: true,
    });
    roomy.style.inlineSize = "24rem";
    await waitForCardStyles(compact);
    await waitForCardStyles(roomy);
    await nextFrame();
    await nextFrame();

    const compactCard = compact.shadowRoot.querySelector(".card");
    const roomyCard = roomy.shadowRoot.querySelector(".card");
    const compactChart = compact.shadowRoot.querySelector(".chart");
    const roomyChart = roomy.shadowRoot.querySelector(".chart");
    const compactValue = Number.parseFloat(
      getComputedStyle(compact.shadowRoot.querySelector(".value")).fontSize,
    );
    const roomyValue = Number.parseFloat(
      getComputedStyle(roomy.shadowRoot.querySelector(".value")).fontSize,
    );

    expect(Number.parseFloat(getComputedStyle(compactCard).paddingTop)).to.be.below(
      Number.parseFloat(getComputedStyle(roomyCard).paddingTop),
    );
    expect(
      getComputedStyle(compactChart).getPropertyValue("--rowan-sparkline-height").trim(),
    ).to.equal("1.5rem");
    expect(
      getComputedStyle(compactChart).getPropertyValue("--rowan-column-sparkline-height").trim(),
    ).to.equal("1.5rem");
    expect(
      getComputedStyle(roomyChart).getPropertyValue("--rowan-sparkline-height").trim(),
    ).to.equal("2.75rem");
    expect(
      getComputedStyle(roomyChart).getPropertyValue("--rowan-column-sparkline-height").trim(),
    ).to.equal("2.75rem");
    expect(roomyValue).to.be.above(compactValue);
    expect(compact.shadowRoot.querySelector("[part='chart']").hidden).to.equal(false);
    expect(compact.shadowRoot.querySelector("[part='delta']").hidden).to.equal(false);
  });

  it("places a slotted gauge beside the metrics except at compact width", async () => {
    const sizes = { mid: "16rem", roomy: "24rem", wide: "40rem" };
    const cards = {};
    for (const [name, inlineSize] of Object.entries(sizes)) {
      const card = await renderCard({
        label: "Utilization",
        value: 72,
        delta: -8,
        deltaLabel: "vs target",
        gauge: true,
      });
      card.style.inlineSize = inlineSize;
      cards[name] = card;
    }
    const compact = await renderCard({
      label: "Utilization",
      value: 72,
      delta: -8,
      deltaLabel: "vs target",
      gauge: true,
    });
    compact.style.inlineSize = "8rem";
    await waitForCardStyles(compact);
    for (const card of Object.values(cards)) {
      await waitForCardStyles(card);
    }
    await nextFrame();
    await nextFrame();

    for (const card of Object.values(cards)) {
      expect(card.shadowRoot.querySelector(".card").hasAttribute("data-has-gauge")).to.equal(true);
      const metrics = card.shadowRoot.querySelector(".metrics").getBoundingClientRect();
      const value = card.shadowRoot.querySelector(".value").getBoundingClientRect();
      const gauge = card.querySelector("rowan-gauge-chart").getBoundingClientRect();
      expect(gauge.left).to.be.above(metrics.right - 1);
      expect(gauge.left - metrics.right).to.be.below(64);
      expect(value.bottom).to.be.above(gauge.top);
      expect(value.top).to.be.below(gauge.bottom);
    }

    expect(compact.shadowRoot.querySelector(".card").hasAttribute("data-has-gauge")).to.equal(true);
    const compactValue = compact.shadowRoot.querySelector(".value").getBoundingClientRect();
    const compactGauge = compact.querySelector("rowan-gauge-chart").getBoundingClientRect();
    expect(compactGauge.top).to.be.above(compactValue.bottom - 1);
  });

  it("lets the body fill the tile when no icon is slotted", async () => {
    const card = await renderCard({
      label: "Open incidents",
      value: 12,
      chart: true,
    });
    card.style.inlineSize = "24rem";
    await waitForCardStyles(card);
    await nextFrame();
    await nextFrame();

    const hostBox = card.getBoundingClientRect();
    const bodyBox = card.shadowRoot.querySelector(".body").getBoundingClientRect();
    const chartSlot = card.shadowRoot.querySelector("[part='chart']");
    const slotted = card.querySelector("[slot='chart']");

    expect(card.shadowRoot.querySelector(".card").hasAttribute("data-has-icon")).to.equal(false);
    expect(bodyBox.width).to.be.above(hostBox.width * 0.8);
    expect(slotted.getBoundingClientRect().width).to.be.above(
      chartSlot.getBoundingClientRect().width * 0.9,
    );

    const icon = document.createElement("span");
    icon.slot = "icon";
    icon.textContent = "*";
    card.append(icon);
    await nextMicrotask();
    await nextMicrotask();
    expect(card.shadowRoot.querySelector(".card").hasAttribute("data-has-icon")).to.equal(true);
  });

  it("updates gauge layout when a slotted gauge is hidden or revealed", async () => {
    const card = await renderCard({
      label: "Utilization",
      value: 72,
      gauge: true,
    });
    card.style.inlineSize = "24rem";
    await waitForCardStyles(card);
    const gauge = card.querySelector("rowan-gauge-chart");

    expect(card.shadowRoot.querySelector(".card").hasAttribute("data-has-gauge")).to.equal(true);

    gauge.hidden = true;
    await nextMicrotask();
    await nextMicrotask();
    expect(card.shadowRoot.querySelector(".card").hasAttribute("data-has-gauge")).to.equal(false);

    gauge.hidden = false;
    await nextMicrotask();
    await nextMicrotask();
    expect(card.shadowRoot.querySelector(".card").hasAttribute("data-has-gauge")).to.equal(true);

    await reconnectHost(card);
    gauge.hidden = true;
    await nextMicrotask();
    await nextMicrotask();
    expect(card.shadowRoot.querySelector(".card").hasAttribute("data-has-gauge")).to.equal(false);
  });

  it("does not un-hide a slotted chart that has hidden", async () => {
    const card = await renderCard({ label: "Open incidents", value: 12 });
    const chart = document.createElement("span");
    chart.slot = "chart";
    chart.hidden = true;
    chart.textContent = "chart";
    card.append(chart);
    await nextMicrotask();
    await nextMicrotask();
    await waitForCardStyles(card);

    expect(chart.hidden).to.equal(true);
    expect(getComputedStyle(chart).display).to.equal("none");
  });
});
