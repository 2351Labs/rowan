import { expect } from "@esm-bundle/chai";
import "./combo-chart.js";
import { createParetoData } from "./pareto.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-combo-chart");
  chart.label = options.label ?? "Defects";
  if (options.labels) chart.labels = options.labels;
  if (options.series) chart.series = options.series;
  if (options.interactive) chart.interactive = true;
  if (options.referenceLines) chart.referenceLines = options.referenceLines;
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
});
