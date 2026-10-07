import { expect } from "@esm-bundle/chai";
import {
  assertPointControlAlignment,
  assertPointControlKeyboardNavigation,
  assertPointControlLifecycle,
} from "../../test/chart-interactions.js";
import "./combo-chart.js";
import { createParetoData } from "./pareto.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-combo-chart");
  chart.label = options.label !== undefined ? options.label : "Defects";
  if (options.labels) chart.labels = options.labels;
  if (options.series) chart.series = options.series;
  if (options.interactive) chart.interactive = true;
  if (options.referenceLines) chart.referenceLines = options.referenceLines;
  if (options.locale !== undefined) chart.locale = options.locale;
  if (options.messages !== undefined) chart.messages = options.messages;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-combo-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("draws bars and a line without reflecting series", async () => {
    const chart = await renderChart({
      labels: ["A", "B", "C"],
      series: [
        { id: "count", label: "Count", geometry: "bar", values: [10, null, 4] },
        { id: "share", label: "Share", geometry: "line", axis: "secondary", values: [50, 80, 100] },
      ],
    });

    expect(chart.hasAttribute("series")).to.equal(false);
    expect(chart.shadowRoot.querySelectorAll("rect.bar")).to.have.length(2);
    expect(chart.shadowRoot.querySelector("polyline.line")).to.not.equal(null);
    expect(chart.shadowRoot.querySelectorAll("circle.line-point")).to.have.length(3);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Count");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("No data");
    expect(chart.shadowRoot.querySelector(".y-axis-secondary").hidden).to.equal(false);
  });

  it("builds sorted Pareto series with a cumulative percent line", () => {
    const pareto = createParetoData({
      labels: ["Wiring", "Seal", "Other", "Hinge"],
      values: [10, 40, 5, 20],
    });

    expect(pareto.labels).to.deep.equal(["Seal", "Hinge", "Wiring", "Other"]);
    expect(pareto.series[0].geometry).to.equal("bar");
    expect(pareto.series[0].values).to.deep.equal([40, 20, 10, 5]);
    expect(pareto.series[1].geometry).to.equal("line");
    expect(pareto.series[1].axis).to.equal("secondary");
    expect(pareto.series[1].values[0]).to.be.closeTo(53.333, 0.01);
    expect(pareto.series[1].values[3]).to.equal(100);
  });

  it("defaults geometry to bar and falls back from invalid values", async () => {
    const chart = await renderChart({
      labels: ["A", "B"],
      series: [
        { id: "count", label: "Count", values: [10, 4] },
        { id: "share", label: "Share", geometry: "scatter", values: [2, 3] },
      ],
    });

    expect(chart.series[0].geometry).to.equal("bar");
    expect(chart.series[1].geometry).to.equal("bar");
    expect(chart.shadowRoot.querySelectorAll("rect.bar")).to.have.length(4);
    expect(chart.shadowRoot.querySelector("path.area")).to.equal(null);
  });

  it("draws an area fill behind bars", async () => {
    const chart = await renderChart({
      labels: ["A", "B", "C"],
      series: [
        { id: "volume", label: "Volume", geometry: "area", values: [8, null, 4] },
        { id: "count", label: "Count", geometry: "bar", values: [10, 6, 4] },
      ],
    });
    const plot = chart.shadowRoot.querySelector(".plot");
    const area = plot.querySelector("path.area");
    const firstBar = plot.querySelector("rect.bar");
    expect(area).to.not.equal(null);
    expect(area.getAttribute("d")).to.include("Z");
    expect(area.compareDocumentPosition(firstBar) & Node.DOCUMENT_POSITION_FOLLOWING).to.not.equal(
      0,
    );
    expect(chart.shadowRoot.querySelectorAll("circle.line-point")).to.have.length(2);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Volume8No data4");
  });

  it("emits rowan-point-activate from an interactive bar", async () => {
    const chart = await renderChart({
      interactive: true,
      labels: ["A", "B"],
      series: [{ id: "count", label: "Count", values: [10, 4] }],
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.shadowRoot.querySelector('button[data-point-key="count::0"]').click();
    await nextMicrotask();

    expect(activations).to.have.length(1);
    expect(activations[0].seriesId).to.equal("count");
    expect(activations[0].value).to.equal(10);
  });

  it("moves keyboard focus between named point controls", async () => {
    const chart = await renderChart({
      interactive: true,
      labels: ["A", "B"],
      series: [{ id: "count", label: "Count", values: [10, 4] }],
    });
    await assertPointControlKeyboardNavigation(chart);
  });

  it("keeps an overlay hit target on its SVG bar in LTR and RTL hosts", async () => {
    const chart = await renderChart({
      interactive: true,
      labels: ["A", "B"],
      series: [{ id: "count", label: "Count", values: [10, 4] }],
    });
    await assertPointControlAlignment({
      chart,
      pointSelector: "rect.bar",
      pointKey: "count::0",
    });
  });

  it("restores point focus after rerender and hides hover after reconnects", async () => {
    const chart = await renderChart({
      interactive: true,
      labels: ["A", "B"],
      series: [{ id: "count", label: "Count", values: [10, 4] }],
    });
    await assertPointControlLifecycle({
      chart,
      rerender: () => {
        chart.labels = [...chart.labels];
      },
      markSelector: "rect.bar",
    });
  });

  it("uses locale and property-only messages for generated chart and reference copy", async () => {
    const chart = await renderChart({
      label: "",
      locale: "de-DE",
      labels: ["A", "B"],
      series: [{ id: "count", label: "Anzahl", geometry: "bar", values: [1234.5, null] }],
      referenceLines: [{ value: 2000 }],
      messages: {
        chart: "Kombinationsdiagramm",
        dataTable: "Datentabelle",
        dataTableCaption: "Tabelle: {chart}",
        metric: "Kennzahl",
        noData: "Keine Daten",
        reference: "Bezugswert",
        series: "Reihen",
      },
    });
    const formatted = new Intl.NumberFormat("de-DE").format(1234.5);
    const table = chart.shadowRoot.querySelector("table");

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.locale).to.equal("de-DE");
    expect(chart.internals.ariaLabel).to.equal("Kombinationsdiagramm");
    expect(chart.shadowRoot.querySelector(".legend").getAttribute("aria-label")).to.equal("Reihen");
    expect(chart.shadowRoot.querySelector("summary").textContent).to.equal("Datentabelle");
    expect(table.querySelector("caption").textContent).to.equal("Tabelle: Kombinationsdiagramm");
    expect(table.textContent).to.include(`KennzahlABAnzahl${formatted}Keine DatenBezugswert2.000`);

    const hover = chart.shadowRoot.querySelector(".hover");
    chart.shadowRoot
      .querySelector("g.reference-line-group")
      .dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 24, clientY: 24 }));
    expect(hover.textContent).to.include("Bezugswert");
  });

  it("localizes generated point labels without replacing authored labels", async () => {
    const chart = await renderChart({
      label: "",
      interactive: true,
      labels: [],
      series: [
        {
          id: "count",
          label: "Anzahl",
          geometry: "bar",
          values: [4, { label: "Point 1", value: 8 }],
        },
      ],
      messages: { point: "Punkt {index}" },
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal("Punkt 1Point 1");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include(
      "MetricPunkt 1Point 1Anzahl48",
    );
    expect(
      chart.shadowRoot
        .querySelector('button[data-point-key="count::0"]')
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
