import { expect } from "@esm-bundle/chai";
import "./box-plot-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-box-plot-chart");
  chart.label = options.label ?? "Lane dwell";
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
      series: [{ id: "dwell", label: "Dwell", values: [{ min: 1, q1: 2, median: 3, q3: 4, max: 5 }] }],
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
});
