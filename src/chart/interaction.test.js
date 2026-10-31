import { expect } from "@esm-bundle/chai";
import { prefersReducedMotion, readHiddenSeries, writeHiddenSeries } from "./api.js";
import { bindSeriesLegend, syncSeriesLegend } from "./legend.js";
import { createChartHoverBubble, showChartHover } from "./hover.js";
import "../bar-chart/bar-chart.js";
import "../sparkline/sparkline.js";

const nextMicrotask = () => Promise.resolve();

async function barChart() {
  const chart = document.createElement("rowan-bar-chart");
  chart.label = "Throughput";
  chart.interactive = true;
  chart.labels = ["Mon", "Tue"];
  chart.series = [
    { id: "incoming", label: "Incoming", values: [4, 8] },
    { id: "resolved", label: "Resolved", values: [2, 6] },
  ];
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("chart interaction", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reads and writes hidden-series from the attribute", () => {
    const host = document.createElement("div");
    writeHiddenSeries(host, ["a", "b"]);
    expect(host.getAttribute("hidden-series")).to.equal("a b");
    expect(readHiddenSeries(host)).to.deep.equal(["a", "b"]);
    writeHiddenSeries(host, []);
    expect(host.hasAttribute("hidden-series")).to.equal(false);
  });

  it("reports prefers-reduced-motion from matchMedia", () => {
    const original = window.matchMedia;
    window.matchMedia = (query) => ({
      matches: query.includes("reduce"),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    });
    expect(prefersReducedMotion()).to.equal(true);
    window.matchMedia = original;
  });

  it("shows a tooltip from showChartHover", () => {
    const bubble = createChartHoverBubble();
    document.body.append(bubble);
    showChartHover(bubble, "Incoming, Mon: 4", 20, 20);
    expect(bubble.hidden).to.equal(false);
    expect(bubble.textContent).to.equal("Incoming, Mon: 4");
    expect(bubble.getAttribute("role")).to.equal("tooltip");
  });

  it("hides a series from hiddenSeries and keeps it in the data table", async () => {
    const chart = await barChart();
    chart.hiddenSeries = ["incoming"];
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.getAttribute("hidden-series")).to.equal("incoming");
    const hiddenBar = chart.shadowRoot.querySelector('rect.bar[data-point-key="incoming::0"]');
    expect(hiddenBar.classList.contains("is-series-hidden")).to.equal(true);
    expect(chart.shadowRoot.querySelector('button[data-point-key="incoming::0"]').hidden).to.equal(
      true,
    );
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Incoming");
  });

  it("toggles a series from the shared legend helper", async () => {
    const chart = await barChart();
    const legend = chart.shadowRoot.querySelector(".legend");
    bindSeriesLegend(chart, legend);
    syncSeriesLegend(
      chart,
      legend,
      [...chart.series].map((series) => series.id),
    );
    const button = legend.querySelector('button[data-series-id="incoming"]');
    const toggles = [];
    chart.addEventListener("rowan-series-toggle", (event) => toggles.push(event.detail));
    button.click();
    await nextMicrotask();
    await nextMicrotask();
    expect(toggles[0].seriesId).to.equal("incoming");
    expect(chart.hiddenSeries).to.deep.equal(["incoming"]);
  });

  it("does not hide a series when rowan-series-toggle is canceled", async () => {
    const chart = await barChart();
    const legend = chart.shadowRoot.querySelector(".legend");
    bindSeriesLegend(chart, legend);
    syncSeriesLegend(
      chart,
      legend,
      [...chart.series].map((series) => series.id),
    );
    chart.addEventListener("rowan-series-toggle", (event) => event.preventDefault());
    legend.querySelector('button[data-series-id="resolved"]').click();
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.hiddenSeries).to.deep.equal([]);
  });

  it("emits cancelable selection events and skips selection-change when the click is canceled", async () => {
    const chart = await barChart();
    const clicks = [];
    const selections = [];
    chart.addEventListener("rowan-point-click", (event) => {
      clicks.push(event.detail);
      event.preventDefault();
    });
    chart.addEventListener("rowan-selection-change", (event) => selections.push(event.detail));
    chart.shadowRoot.querySelector('button[data-point-key="incoming::0"]').click();
    await nextMicrotask();

    expect(clicks).to.have.length(1);
    expect(clicks[0].series).to.deep.equal({ id: "incoming", label: "Incoming" });
    expect(clicks[0].index).to.equal(0);
    expect(clicks[0].value).to.equal(4);
    expect(clicks[0].datum.value).to.equal(4);
    expect(selections).to.have.length(0);
  });

  it("moves to the last point with End and shows a focus tooltip", async () => {
    const chart = await barChart();
    const point = chart.shadowRoot.querySelector('button[data-point-key="incoming::0"]');
    point.focus();
    point.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "End" }),
    );
    const last = chart.shadowRoot.querySelector('button[data-point-key="resolved::1"]');
    expect(chart.shadowRoot.activeElement).to.equal(last);
    expect(chart.shadowRoot.querySelector(".detail").textContent).to.include("Resolved");
    const hover = chart.shadowRoot.querySelector(".hover");
    expect(hover.hidden).to.equal(false);
    expect(hover.textContent).to.include("Resolved");
  });

  it("uses tooltipFormatter and disables motion with no-motion", async () => {
    const chart = await barChart();
    chart.tooltipFormatter = () => "Custom tip";
    chart.noMotion = true;
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.hasAttribute("no-motion")).to.equal(true);

    const bar = chart.shadowRoot.querySelector("rect.bar");
    bar.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 40, clientY: 40 }));
    expect(chart.shadowRoot.querySelector(".hover").textContent).to.equal("Custom tip");

    const link = chart.shadowRoot.querySelector('link[rel="stylesheet"]');
    if (link && !link.sheet) {
      await new Promise((resolve) => link.addEventListener("load", resolve, { once: true }));
    }
    expect(getComputedStyle(bar).transitionDuration).to.equal("0s");
  });

  it("shows a sparkline tooltip and keeps a visually hidden data table", async () => {
    const chart = document.createElement("rowan-sparkline");
    chart.label = "Incidents";
    chart.values = [2, 5, 3];
    document.body.append(chart);
    await nextMicrotask();
    await nextMicrotask();
    const plot = chart.shadowRoot.querySelector(".plot");
    plot.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 30, clientY: 10 }));
    expect(chart.shadowRoot.querySelector(".hover").hidden).to.equal(false);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("5");
    expect(chart.shadowRoot.querySelector(".detail")).to.exist;
  });
});
