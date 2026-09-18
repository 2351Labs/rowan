import { expect } from "@esm-bundle/chai";
import "./donut-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-donut-chart");
  chart.label = options.label ?? "Incident sources";
  chart.labels = options.labels ?? ["App", "Email", "Phone"];
  chart.series = options.series ?? [{ id: "sources", label: "Sources", values: [12, -3, 8] }];
  if (options.interactive) chart.interactive = true;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-donut-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("treats negative values as no-data and totals only positive slices", async () => {
    const chart = await renderChart();

    expect(chart.shadowRoot.querySelectorAll("path.slice")).to.have.length(2);
    expect(chart.shadowRoot.querySelector("[part='total']").textContent).to.equal("20");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include(
      "Sources12No data8",
    );
  });

  it("emits rowan-point-activate from an interactive slice control", async () => {
    const chart = await renderChart({
      interactive: true,
      series: [{ id: "sources", label: "Sources", values: [12, 8] }],
      labels: ["App", "Phone"],
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.shadowRoot.querySelector('button[data-point-key="sources::0"]').click();
    await nextMicrotask();

    expect(activations[0].seriesId).to.equal("sources");
    expect(activations[0].label).to.equal("App");
    expect(activations[0].value).to.equal(12);
  });
});
