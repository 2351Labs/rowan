import { expect } from "@esm-bundle/chai";
import "./waterfall-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-waterfall-chart");
  chart.label = options.label ?? "Cash movement";
  chart.labels = options.labels ?? ["Start", "In", "Out", "Hold", "End"];
  chart.series = options.series ?? [
    {
      id: "cash",
      label: "Cash",
      values: [{ value: 20, type: "total" }, 10, -4, null, { value: 26, type: "total" }],
    },
  ];
  if (options.interactive) chart.interactive = true;
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
});
