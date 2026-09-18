import { expect } from "@esm-bundle/chai";
import "./bar-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-bar-chart");
  chart.label = options.label ?? "Incidents by day";
  chart.labels = options.labels ?? ["Mon", "Tue", "Wed"];
  chart.series = options.series ?? [
    { id: "incoming", label: "Incoming", values: [4, null, 8] },
    { id: "resolved", label: "Resolved", values: [2, 7, 6] },
  ];
  if (options.interactive) chart.interactive = true;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-bar-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders grouped bars and a matching data table, skipping nulls", async () => {
    const chart = await renderChart();

    expect(chart.hasAttribute("series")).to.equal(false);
    expect(chart.shadowRoot.querySelectorAll("rect.bar")).to.have.length(5);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Incoming4No data8");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Resolved276");
    expect(chart.shadowRoot.querySelectorAll("button")).to.have.length(0);
  });

  it("emits rowan-point-activate from an interactive bar", async () => {
    const chart = await renderChart({ interactive: true });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    const button = chart.shadowRoot.querySelector('button[data-point-key="incoming::0"]');
    button.click();
    await nextMicrotask();

    expect(activations).to.have.length(1);
    expect(activations[0].seriesId).to.equal("incoming");
    expect(activations[0].index).to.equal(0);
    expect(activations[0].value).to.equal(4);
  });
});
