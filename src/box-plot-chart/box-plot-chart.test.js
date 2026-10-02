import { expect } from "@esm-bundle/chai";
import {
  assertPointControlAlignment,
  assertPointControlKeyboardNavigation,
  assertPointControlLifecycle,
} from "../../test/chart-interactions.js";
import "./box-plot-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-box-plot-chart");
  chart.label = options.label !== undefined ? options.label : "Lane dwell";
  chart.labels = options.labels ?? ["North", "South", "West"];
  chart.series = options.series ?? [
    {
      id: "dwell",
      label: "Dwell",
      values: [
        { min: 2, q1: 4, median: 6, q3: 9, max: 12, outliers: [16] },
        { min: 3, q1: null, median: 7, q3: 10, max: 14 },
        { min: 1, q1: 3, median: 5, q3: 8, max: 11 },
      ],
    },
  ];
  if (options.interactive) chart.interactive = true;
  if (options.locale !== undefined) chart.locale = options.locale;
  if (options.messages !== undefined) chart.messages = options.messages;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-box-plot-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("skips incomplete five-number summaries and does not invent quartiles", async () => {
    const chart = await renderChart();
    expect(chart.hasAttribute("series")).to.equal(false);
    expect(chart.shadowRoot.querySelectorAll("rect.box")).to.have.length(2);
    expect(chart.shadowRoot.querySelectorAll("circle.outlier")).to.have.length(1);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("No data");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("16");
    expect(chart.series[0].values[1].q1).to.equal(null);
  });

  it("treats whitespace and unordered five-number summaries as no-data", async () => {
    const chart = await renderChart({
      series: [
        {
          id: "dwell",
          label: "Dwell",
          values: [
            { min: " ", q1: 4, median: 6, q3: 9, max: 12 },
            { min: 12, q1: 9, median: 6, q3: 4, max: 2 },
            { min: 1, q1: 3, median: 5, q3: 8, max: 11, outliers: [16] },
          ],
        },
      ],
    });
    expect(chart.shadowRoot.querySelectorAll("rect.box")).to.have.length(1);
    expect(chart.series[0].values[0].min).to.equal(null);
    expect(chart.shadowRoot.querySelectorAll("circle.outlier")).to.have.length(1);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("No data");
  });

  it("does not emit when series is set, and config replaces data", async () => {
    const chart = await renderChart();
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));
    chart.series = [...chart.series];
    await nextMicrotask();
    await nextMicrotask();
    expect(activations).to.have.length(0);

    chart.config = {
      labels: ["A"],
      series: [
        { id: "dwell", label: "Dwell", values: [{ min: 1, q1: 2, median: 3, q3: 4, max: 5 }] },
      ],
    };
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.shadowRoot.querySelectorAll("rect.box")).to.have.length(1);
    expect(activations).to.have.length(0);
  });

  it("emits rowan-point-activate with the five-number summary", async () => {
    const chart = await renderChart({ interactive: true });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.shadowRoot.querySelector('button[data-point-key="dwell::0"]').click();
    await nextMicrotask();
    expect(activations).to.have.length(1);
    expect(activations[0].seriesId).to.equal("dwell");
    expect(activations[0].value).to.equal(6);
    expect(activations[0].min).to.equal(2);
    expect(activations[0].q1).to.equal(4);
    expect(activations[0].median).to.equal(6);
    expect(activations[0].q3).to.equal(9);
    expect(activations[0].max).to.equal(12);
    expect(activations[0]).to.not.have.property("plotX");
  });

  it("moves keyboard focus between named point controls", async () => {
    const chart = await renderChart({ interactive: true });
    await assertPointControlKeyboardNavigation(chart);
  });

  it("keeps an overlay hit target on its SVG box in LTR and RTL hosts", async () => {
    const chart = await renderChart({ interactive: true });
    await assertPointControlAlignment({
      chart,
      pointSelector: "rect.box",
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
      markSelector: "rect.box",
    });
  });

  it("uses locale and property-only messages for generated chart copy", async () => {
    const chart = await renderChart({
      label: "",
      locale: "de-DE",
      interactive: true,
      labels: ["Nord", "Süd"],
      series: [
        {
          id: "dwell",
          label: "Verweilzeit",
          values: [
            { min: 1234.5, q1: 1500, median: 1800, q3: 2000, max: 2234.5, outliers: [2500] },
            { min: 3, q1: null, median: 7, q3: 10, max: 14 },
          ],
        },
      ],
      messages: {
        category: "Kategorie",
        chart: "Boxplot",
        dataTable: "Datentabelle",
        dataTableCaption: "Tabelle: {chart}",
        max: "Maximum",
        maxValue: "maximum",
        median: "Median",
        medianValue: "median",
        min: "Minimum",
        minValue: "minimum",
        noData: "Keine Daten",
        outliers: "Ausreisser",
        q1: "Q1",
        q1Value: "q1",
        q3: "Q3",
        q3Value: "q3",
        series: "Reihen",
      },
    });
    const formatted = new Intl.NumberFormat("de-DE").format(1234.5);
    const table = chart.shadowRoot.querySelector("table");
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.messages = { ...chart.messages, chart: "Aktualisierter Boxplot" };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.locale).to.equal("de-DE");
    expect(chart.internals.ariaLabel).to.equal("Aktualisierter Boxplot");
    expect(chart.shadowRoot.querySelector(".legend").getAttribute("aria-label")).to.equal("Reihen");
    expect(chart.shadowRoot.querySelector("summary").textContent).to.equal("Datentabelle");
    expect(table.querySelector("caption").textContent).to.equal("Tabelle: Aktualisierter Boxplot");
    expect(table.textContent).to.include(
      `ReihenKategorieMinimumQ1MedianQ3MaximumAusreisserVerweilzeitNord${formatted}`,
    );
    expect(table.textContent).to.include("Keine Daten");
    expect(
      chart.shadowRoot
        .querySelector('button[data-point-key="dwell::0"]')
        .getAttribute("aria-label"),
    ).to.include(`minimum=${formatted}`);
    expect(activations).to.have.length(0);
  });

  it("localizes generated point labels without replacing authored labels", async () => {
    const chart = await renderChart({
      label: "",
      interactive: true,
      labels: [],
      series: [
        {
          id: "dwell",
          label: "Verweilzeit",
          values: [
            { min: 2, q1: 4, median: 6, q3: 9, max: 12 },
            { label: "Point 1", min: 3, q1: 5, median: 7, q3: 10, max: 14 },
          ],
        },
      ],
      messages: { point: "Punkt {index}" },
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal("Punkt 1Point 1");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Punkt 1");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Point 1");
    expect(
      chart.shadowRoot
        .querySelector('button[data-point-key="dwell::0"]')
        .getAttribute("aria-label"),
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
