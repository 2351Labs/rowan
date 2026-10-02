import { expect } from "@esm-bundle/chai";
import {
  assertPointControlAlignment,
  assertPointControlKeyboardNavigation,
  assertPointControlLifecycle,
} from "../../test/chart-interactions.js";
import "./range-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-range-chart");
  chart.label = options.label !== undefined ? options.label : "SLA window";
  chart.labels = options.labels ?? ["Mon", "Tue", "Wed"];
  chart.series = options.series ?? [
    {
      id: "dwell",
      label: "Dwell",
      values: [
        { low: 4, high: 12 },
        { low: null, high: 18 },
        { low: 6, high: 10 },
      ],
    },
  ];
  if (options.interactive) chart.interactive = true;
  if (options.variant) chart.variant = options.variant;
  if (options.locale !== undefined) chart.locale = options.locale;
  if (options.messages !== undefined) chart.messages = options.messages;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-range-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("skips null low or high and does not reflect series", async () => {
    const chart = await renderChart();
    expect(chart.variant).to.equal("bar");
    expect(chart.hasAttribute("variant")).to.equal(false);
    expect(chart.hasAttribute("series")).to.equal(false);
    expect(chart.shadowRoot.querySelectorAll("rect.bar")).to.have.length(2);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Dwell");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("No data");
  });

  it("treats whitespace and reversed ranges as no-data", async () => {
    const chart = await renderChart({
      series: [
        {
          id: "dwell",
          label: "Dwell",
          values: [
            { low: " ", high: 12 },
            { low: 12, high: 4 },
            { low: 6, high: 6 },
          ],
        },
      ],
    });
    expect(chart.shadowRoot.querySelectorAll("rect.bar")).to.have.length(1);
    expect(chart.series[0].values[0].low).to.equal(null);
    expect(chart.shadowRoot.querySelector("table").textContent).to.match(/No data.*No data/s);
  });

  it("draws an area band and omitted config variant resets to bar", async () => {
    const chart = await renderChart({
      variant: "area",
      series: [
        {
          id: "dwell",
          label: "Dwell",
          values: [
            { low: 4, high: 12 },
            { low: 8, high: 16 },
            { low: 6, high: 10 },
          ],
        },
      ],
    });
    expect(chart.variant).to.equal("area");
    expect(chart.shadowRoot.querySelectorAll("path.series-area")).to.have.length(1);
    expect(chart.shadowRoot.querySelectorAll("circle.point")).to.have.length(3);

    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));
    chart.variant = "spiral";
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.variant).to.equal("bar");
    expect(chart.hasAttribute("variant")).to.equal(false);
    expect(activations).to.have.length(0);

    chart.variant = "area";
    chart.config = { labels: chart.labels, series: chart.series };
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.variant).to.equal("bar");
    expect(activations).to.have.length(0);
  });

  it("emits rowan-point-activate with low and high from an interactive bar", async () => {
    const chart = await renderChart({ interactive: true });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));
    chart.series = [...chart.series];
    await nextMicrotask();
    await nextMicrotask();
    expect(activations).to.have.length(0);

    chart.shadowRoot.querySelector('button[data-point-key="dwell::0"]').click();
    await nextMicrotask();
    expect(activations).to.have.length(1);
    expect(activations[0].seriesId).to.equal("dwell");
    expect(activations[0].low).to.equal(4);
    expect(activations[0].high).to.equal(12);
    expect(activations[0].formattedValue).to.equal("low=4, high=12");
    expect(activations[0]).to.not.have.property("plotX");
  });

  it("moves keyboard focus between named point controls", async () => {
    const chart = await renderChart({ interactive: true });
    await assertPointControlKeyboardNavigation(chart);
  });

  it("keeps an overlay hit target on its SVG bar in LTR and RTL hosts", async () => {
    const chart = await renderChart({ interactive: true });
    await assertPointControlAlignment({
      chart,
      pointSelector: "rect.bar",
      pointKey: "dwell::0",
    });
  });

  it("restores point focus after rerender and hides hover after reconnects", async () => {
    const chart = await renderChart({ interactive: true });
    await assertPointControlLifecycle({
      chart,
      rerender: () => {
        chart.labels = [...chart.labels];
      },
      markSelector: "rect.bar",
    });
  });

  it("uses locale and property-only messages for generated chart copy", async () => {
    const chart = await renderChart({
      label: "",
      locale: "de-DE",
      interactive: true,
      labels: ["Mo", "Di"],
      series: [
        {
          id: "flow",
          label: "Durchsatz",
          values: [
            { low: 1234.5, high: 2234.5 },
            { low: null, high: 8 },
          ],
        },
      ],
      messages: {
        category: "Kategorie",
        chart: "Bereichsdiagramm",
        dataTable: "Datentabelle",
        dataTableCaption: "Tabelle: {chart}",
        high: "Oben",
        highValue: "oben",
        low: "Unten",
        lowValue: "unten",
        noData: "Keine Daten",
        series: "Reihen",
      },
    });
    const formatted = new Intl.NumberFormat("de-DE").format(1234.5);
    const table = chart.shadowRoot.querySelector("table");
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.messages = { ...chart.messages, chart: "Aktualisiertes Bereichsdiagramm" };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.locale).to.equal("de-DE");
    expect(chart.internals.ariaLabel).to.equal("Aktualisiertes Bereichsdiagramm");
    expect(chart.shadowRoot.querySelector(".legend").getAttribute("aria-label")).to.equal("Reihen");
    expect(chart.shadowRoot.querySelector("summary").textContent).to.equal("Datentabelle");
    expect(table.querySelector("caption").textContent).to.equal(
      "Tabelle: Aktualisiertes Bereichsdiagramm",
    );
    expect(table.textContent).to.include(`ReihenKategorieUntenObenDurchsatzMo${formatted}`);
    expect(table.textContent).to.include("Keine Daten");
    expect(
      chart.shadowRoot.querySelector('button[data-point-key="flow::0"]').getAttribute("aria-label"),
    ).to.include(`unten=${formatted}`);
    expect(activations).to.have.length(0);
  });

  it("localizes generated point labels without replacing authored labels", async () => {
    const chart = await renderChart({
      label: "",
      interactive: true,
      labels: [],
      series: [
        {
          id: "flow",
          label: "Durchsatz",
          values: [
            { low: 4, high: 8 },
            { label: "Point 1", low: 6, high: 10 },
          ],
        },
      ],
      messages: { point: "Punkt {index}" },
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal("Punkt 1Point 1");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include(
      "SeriesCategoryLowHighDurchsatzPunkt 148DurchsatzPoint 1610",
    );
    expect(
      chart.shadowRoot.querySelector('button[data-point-key="flow::0"]').getAttribute("aria-label"),
    ).to.include("Punkt 1");

    chart.config = { ...chart.config, interactive: true };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal("Punkt 1Point 1");

    chart.messages = { point: "Kategorie {index}" };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal("Kategorie 1Point 1");
    expect(activations).to.deep.equal([]);
  });
});
