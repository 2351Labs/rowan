import { expect } from "@esm-bundle/chai";
import {
  assertPointControlAlignment,
  assertPointControlKeyboardNavigation,
  assertPointControlLifecycle,
} from "../../test/chart-interactions.js";
import "./waterfall-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-waterfall-chart");
  chart.label = options.label !== undefined ? options.label : "Cash movement";
  chart.labels = options.labels ?? ["Start", "In", "Out", "Hold", "End"];
  chart.series = options.series ?? [
    {
      id: "cash",
      label: "Cash",
      values: [{ value: 20, type: "total" }, 10, -4, null, { value: 26, type: "total" }],
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

describe("rowan-waterfall-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("draws signed deltas and authored totals, skipping null", async () => {
    const chart = await renderChart();
    const bars = [...chart.shadowRoot.querySelectorAll("rect.bar")];
    expect(chart.hasAttribute("series")).to.equal(false);
    expect(bars).to.have.length(4);
    expect(chart.shadowRoot.querySelectorAll('rect.bar[data-tone="info"]')).to.have.length(2);
    expect(chart.shadowRoot.querySelectorAll('rect.bar[data-tone="success"]')).to.have.length(1);
    expect(chart.shadowRoot.querySelectorAll('rect.bar[data-tone="danger"]')).to.have.length(1);
    expect(chart.shadowRoot.querySelectorAll("line.connector")).to.have.length(3);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("No data");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("total");

    const start = chart.shadowRoot.querySelector('rect[data-point-key="cash::0"]');
    expect(Number(start.getAttribute("height"))).to.be.above(1);
  });

  it("does not invent a total when none is authored", async () => {
    const chart = await renderChart({
      labels: ["A", "B", "C"],
      series: [{ id: "cash", label: "Cash", values: [10, -4, 8] }],
    });
    expect(chart.shadowRoot.querySelectorAll("rect.bar")).to.have.length(3);
    expect(chart.shadowRoot.querySelectorAll('rect.bar[data-tone="info"]')).to.have.length(0);
    expect(chart.series[0].values.map((point) => point.type)).to.deep.equal([
      "delta",
      "delta",
      "delta",
    ]);
  });

  it("emits rowan-point-activate with type from an interactive bar", async () => {
    const chart = await renderChart({ interactive: true });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));
    chart.series = [...chart.series];
    await nextMicrotask();
    await nextMicrotask();
    expect(activations).to.have.length(0);

    chart.shadowRoot.querySelector('button[data-point-key="cash::0"]').click();
    await nextMicrotask();
    expect(activations[0].seriesId).to.equal("cash");
    expect(activations[0].type).to.equal("total");
    expect(activations[0].value).to.equal(20);

    chart.shadowRoot.querySelector('button[data-point-key="cash::2"]').click();
    await nextMicrotask();
    expect(activations[1].type).to.equal("delta");
    expect(activations[1].value).to.equal(-4);
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
      pointKey: "cash::0",
    });
  });

  it("restores point focus after rerender and hides hover after reconnects", async () => {
    const chart = await renderChart({ interactive: true });
    await assertPointControlLifecycle({
      chart,
      rerender: () => {
        chart.series = [...chart.series];
      },
      markSelector: "rect.bar",
    });
  });

  it("uses locale and property-only messages for generated chart copy", async () => {
    const chart = await renderChart({
      label: "",
      locale: "de-DE",
      interactive: true,
      labels: ["Start", "Lücke"],
      series: [
        {
          id: "cash",
          label: "Kasse",
          values: [{ value: 1234.5, type: "total" }, null],
        },
      ],
      messages: {
        category: "Kategorie",
        chart: "Wasserfalldiagramm",
        dataTable: "Datentabelle",
        dataTableCaption: "Tabelle: {chart}",
        decrease: "Rückgang",
        deltaValue: "Änderung",
        encodings: "Kodierungen",
        increase: "Anstieg",
        noData: "Keine Daten",
        total: "Gesamt",
        totalValue: "Gesamt",
        type: "Art",
        value: "Wert",
      },
    });
    const formatted = new Intl.NumberFormat("de-DE").format(1234.5);
    const table = chart.shadowRoot.querySelector("table");
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.messages = { ...chart.messages, chart: "Aktualisiertes Wasserfalldiagramm" };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.locale).to.equal("de-DE");
    expect(chart.internals.ariaLabel).to.equal("Aktualisiertes Wasserfalldiagramm");
    expect(chart.shadowRoot.querySelector(".legend").getAttribute("aria-label")).to.equal(
      "Kodierungen",
    );
    expect(chart.shadowRoot.querySelector("summary").textContent).to.equal("Datentabelle");
    expect(table.querySelector("caption").textContent).to.equal(
      "Tabelle: Aktualisiertes Wasserfalldiagramm",
    );
    expect(table.textContent).to.include(`KategorieArtWertStartGesamt${formatted}`);
    expect(table.textContent).to.include("Keine Daten");
    expect(
      chart.shadowRoot.querySelector('button[data-point-key="cash::0"]').getAttribute("aria-label"),
    ).to.include("Gesamt");
    expect(activations).to.have.length(0);
  });

  it("localizes generated point labels without replacing authored labels", async () => {
    const chart = await renderChart({
      label: "",
      interactive: true,
      labels: [],
      series: [
        {
          id: "cash",
          label: "Kasse",
          values: [{ value: 4 }, { label: "Point 1", value: 8 }],
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
      chart.shadowRoot.querySelector('button[data-point-key="cash::0"]').getAttribute("aria-label"),
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
