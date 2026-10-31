import { expect } from "@esm-bundle/chai";
import "axe-core";
import { prefersReducedMotion, readHiddenSeries, writeHiddenSeries } from "./api.js";
import { bindSeriesLegend, syncSeriesLegend } from "./legend.js";
import { createChartHoverBubble, showChartHover } from "./hover.js";
import "../bar-chart/bar-chart.js";
import "../area-chart/area-chart.js";
import "../sparkline/sparkline.js";
import "../bullet-chart/bullet-chart.js";

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

  async function interactionReady(chart) {
    if (chart.__z) await chart.__z;
    await nextMicrotask();
  }

  it("turns legend rows into toggle buttons after the lazy module loads", async () => {
    const chart = await barChart();
    await interactionReady(chart);
    const button = chart.shadowRoot.querySelector('button.legend-button[data-series-id="incoming"]');
    expect(button, "legend button").to.exist;
    const toggles = [];
    chart.addEventListener("rowan-series-toggle", (event) => toggles.push(event.detail));
    button.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    await nextMicrotask();
    await nextMicrotask();
    expect(toggles[0].seriesId).to.equal("incoming");
    expect(chart.hiddenSeries).to.deep.equal(["incoming"]);
    expect(
      chart.shadowRoot.querySelector('rect.bar[data-point-key="incoming::0"]').classList.contains(
        "is-series-hidden",
      ),
    ).to.equal(true);
  });

  it("shares a cartesian tooltip and keeps it in the viewport", async () => {
    const chart = await barChart();
    await interactionReady(chart);
    const bar = chart.shadowRoot.querySelector('rect.bar[data-point-key="incoming::0"]');
    const box = bar.getBoundingClientRect();
    bar.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: box.left + box.width / 2 || 8,
        clientY: box.top + 4,
      }),
    );
    const hover = chart.shadowRoot.querySelector(".hover");
    expect(hover.hidden).to.equal(false);
    expect(hover.textContent).to.include("Incoming");
    expect(hover.textContent).to.include("Resolved");
    const left = Number.parseFloat(hover.style.left);
    expect(left).to.be.at.least(8);
    expect(chart.shadowRoot.querySelector(".axis-pointer")).to.exist;
  });

  it("zooms from the wheel and resets the view box", async () => {
    const chart = await barChart();
    chart.setAttribute("zoom", "");
    await interactionReady(chart);
    const plot = chart.shadowRoot.querySelector("svg.plot");
    const before = plot.getAttribute("viewBox");
    const zooms = [];
    chart.addEventListener("rowan-zoom", (event) => zooms.push(event.detail));
    plot.dispatchEvent(new WheelEvent("wheel", { bubbles: true, cancelable: true, clientX: 40, clientY: 40, deltaY: -100 }));
    expect(zooms.length).to.be.at.least(1);
    expect(plot.getAttribute("viewBox")).to.not.equal(before);
    const reset = chart.shadowRoot.querySelector(".zoom-reset");
    expect(reset.hidden).to.equal(false);
    reset.click();
    expect(plot.getAttribute("viewBox")).to.equal(before);
  });

  it("redraws when the chart width changes", async () => {
    const chart = await barChart();
    await interactionReady(chart);
    let renders = 0;
    const original = chart.requestRender.bind(chart);
    chart.requestRender = () => {
      renders += 1;
      original();
    };
    chart.style.width = "640px";
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    expect(renders).to.be.at.least(1);
  });

  it("skips the enter animation when no-motion is set", async () => {
    const chart = document.createElement("rowan-bar-chart");
    chart.label = "Throughput";
    chart.interactive = true;
    chart.noMotion = true;
    chart.labels = ["Mon", "Tue"];
    chart.series = [
      { id: "incoming", label: "Incoming", values: [4, 8] },
      { id: "resolved", label: "Resolved", values: [2, 6] },
    ];
    document.body.append(chart);
    await nextMicrotask();
    await nextMicrotask();
    await interactionReady(chart);
    expect(chart.shadowRoot.querySelector(".chart").hasAttribute("data-animate")).to.equal(false);
  });

  it("shares an axis pointer across a sync-group", async () => {
    const make = (values) => {
      const chart = document.createElement("rowan-bar-chart");
      chart.label = "Fill";
      chart.interactive = true;
      chart.labels = ["Mon", "Tue"];
      chart.series = [{ id: "fill", label: "Fill", values }];
      chart.setAttribute("sync-group", "ops");
      document.body.append(chart);
      return chart;
    };
    const north = make([4, 8]);
    const south = make([2, 6]);
    await nextMicrotask();
    await nextMicrotask();
    await interactionReady(north);
    await interactionReady(south);
    const seen = [];
    south.addEventListener("rowan-sync", (event) => seen.push(event.detail));
    north.syncHover(1);
    expect(seen[0].group).to.equal("ops");
    expect(seen[0].index).to.equal(1);
    expect(south.shadowRoot.querySelector(".axis-pointer")).to.exist;
  });

  it("emits rowan-brush for a drag and clears it on Escape", async () => {
    const chart = document.createElement("rowan-bar-chart");
    chart.label = "Fill";
    chart.interactive = true;
    chart.labels = ["Mon", "Tue", "Wed"];
    chart.series = [{ id: "fill", label: "Fill", values: [4, 8, 6] }];
    chart.setAttribute("brush", "");
    document.body.append(chart);
    await nextMicrotask();
    await nextMicrotask();
    await interactionReady(chart);
    const plot = chart.shadowRoot.querySelector("svg.plot");
    const seen = [];
    chart.addEventListener("rowan-brush", (event) => seen.push(event.detail));
    plot.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 0, clientY: 10 }));
    plot.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: 200, clientY: 10 }));
    expect(seen[0].startIndex).to.be.a("number");
    chart.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));
    expect(seen.at(-1).cleared).to.equal(true);
  });

  it("downsamples a large series and pages the full data table", async () => {
    const chart = document.createElement("rowan-area-chart");
    chart.label = "Signal";
    chart.interactive = true;
    const count = 120;
    chart.labels = Array.from({ length: count }, (_, index) => `t${index}`);
    chart.series = [
      {
        id: "signal",
        label: "Signal",
        values: Array.from({ length: count }, (_, index) => Math.round(40 + 20 * Math.sin(index / 6))),
      },
    ];
    chart.setAttribute("large-series", "24");
    document.body.append(chart);
    await nextMicrotask();
    await nextMicrotask();
    await interactionReady(chart);
    await nextMicrotask();
    expect(chart.shadowRoot.querySelectorAll("circle[data-point-key]").length).to.be.below(count);
    expect(chart.shadowRoot.querySelector(".table-pager").textContent).to.include(String(count));
  });

  it("has no WCAG A/AA violations on an interactive bar chart", async () => {
    const href = new URL("../tokens/themes/light.css", import.meta.url).href;
    if (![...document.querySelectorAll("link")].some((link) => link.href === href)) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = href;
      document.head.append(stylesheet);
      if (!stylesheet.sheet) {
        await new Promise((resolve) => stylesheet.addEventListener("load", resolve, { once: true }));
      }
    }
    const chart = await barChart();
    await interactionReady(chart);
    const results = await globalThis.axe.run(chart, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
    });
    expect(results.violations.map((item) => item.id)).to.deep.equal([]);
  });

  it("replays a hover and a wheel that happen before the lazy module loads", async () => {
    const chart = document.createElement("rowan-bar-chart");
    chart.label = "Throughput";
    chart.interactive = true;
    chart.labels = ["Mon", "Tue"];
    chart.series = [
      { id: "incoming", label: "Incoming", values: [4, 8] },
      { id: "resolved", label: "Resolved", values: [2, 6] },
    ];
    chart.setAttribute("zoom", "");
    document.body.append(chart);
    await nextMicrotask();
    const bar = chart.shadowRoot.querySelector('rect.bar[data-point-key="incoming::0"]');
    const box = bar.getBoundingClientRect();
    bar.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: box.left + box.width / 2 || 8,
        clientY: box.top + 4,
      }),
    );
    const plot = chart.shadowRoot.querySelector("svg.plot");
    const before = plot.getAttribute("viewBox");
    plot.dispatchEvent(
      new WheelEvent("wheel", {
        bubbles: true,
        composed: true,
        cancelable: true,
        clientX: 40,
        clientY: 40,
        deltaY: -100,
      }),
    );
    await chart.__z;
    await nextMicrotask();
    expect(chart.shadowRoot.querySelector(".hover").textContent).to.include("Resolved");
    expect(plot.getAttribute("viewBox")).to.not.equal(before);
  });

  it("moves a sparkline and a bullet chart from the keyboard", async () => {
    const spark = document.createElement("rowan-sparkline");
    spark.label = "Incidents";
    spark.labels = ["Mon", "Tue", "Wed"];
    spark.values = [2, 5, 3];
    document.body.append(spark);
    await nextMicrotask();
    await spark.__k;
    const plot = spark.shadowRoot.querySelector("svg.plot");
    expect(plot.tabIndex).to.equal(0);
    const activated = [];
    spark.addEventListener("rowan-point-activate", (event) => activated.push(event.detail));
    plot.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    expect(spark.shadowRoot.querySelector("output.detail").textContent).to.include("5");
    plot.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    expect(activated[0].index).to.equal(1);
    expect(activated[0].label).to.equal("Tue");

    const bullet = document.createElement("rowan-bullet-chart");
    bullet.label = "Fill rate";
    bullet.value = 82;
    bullet.target = 90;
    bullet.ranges = [
      { from: 0, to: 60, label: "Poor" },
      { from: 60, to: 80, label: "Fair" },
      { from: 80, to: 100, label: "Good" },
    ];
    document.body.append(bullet);
    await nextMicrotask();
    await bullet.__k;
    const bulletPlot = bullet.shadowRoot.querySelector("svg.plot");
    bulletPlot.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "End" }));
    expect(bullet.shadowRoot.querySelector("output.detail").textContent).to.include("Target");
    bulletPlot.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Home" }));
    expect(bullet.shadowRoot.querySelector("output.detail").textContent).to.include("Poor");
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
