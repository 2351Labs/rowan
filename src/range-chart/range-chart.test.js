import { expect } from "@esm-bundle/chai";
import "./range-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-range-chart");
  chart.label = options.label ?? "SLA window";
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
});
