import { expect } from "@esm-bundle/chai";
import "./stacked-bar-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-stacked-bar-chart");
  chart.label = options.label ?? "Incidents";
  chart.labels = options.labels ?? ["Mon", "Tue"];
  chart.series = options.series ?? [
    { id: "incoming", label: "Incoming", values: [4, 2] },
    { id: "resolved", label: "Resolved", values: [1, null] },
  ];
  if (options.interactive) chart.interactive = true;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-stacked-bar-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("stacks positive values and treats null as no-data", async () => {
    const chart = await renderChart();

    expect(chart.hasAttribute("series")).to.equal(false);
    const bars = [...chart.shadowRoot.querySelectorAll("rect.bar")];
    expect(bars).to.have.length(3);
    const mondayIncoming = Number(bars[0].getAttribute("y"));
    const mondayResolved = Number(bars[1].getAttribute("y"));
    expect(mondayResolved).to.be.below(mondayIncoming);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Incoming42");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Resolved1No data");
    expect(chart.shadowRoot.querySelectorAll("button")).to.have.length(0);
  });

  it("skips negatives in the stack and table", async () => {
    const chart = await renderChart({
      series: [
        { id: "p1", label: "P1", values: [4, 2] },
        { id: "p2", label: "P2", values: [-3, 1] },
      ],
    });

    expect(chart.shadowRoot.querySelectorAll("rect.bar")).to.have.length(3);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("P142");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("P2No data1");
  });

  it("emits rowan-point-activate from an interactive segment", async () => {
    const chart = await renderChart({ interactive: true });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.shadowRoot.querySelector('button[data-point-key="incoming::0"]').click();
    await nextMicrotask();

    expect(activations).to.have.length(1);
    expect(activations[0].seriesId).to.equal("incoming");
    expect(activations[0].index).to.equal(0);
    expect(activations[0].value).to.equal(4);
  });
});
