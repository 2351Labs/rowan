import { expect } from "@esm-bundle/chai";
import "./area-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-area-chart");
  chart.label = options.label ?? "Volume";
  chart.labels = options.labels ?? ["Mon", "Tue", "Wed"];
  chart.series = options.series ?? [{ id: "flow", label: "Flow", values: [4, null, 8] }];
  if (options.interactive) chart.interactive = true;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-area-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("fills under the line and breaks the fill on null values", async () => {
    const chart = await renderChart();

    expect(chart.hasAttribute("series")).to.equal(false);
    const area = chart.shadowRoot.querySelector("path.series-area");
    const line = chart.shadowRoot.querySelector("path.series-line");
    expect(area).to.not.equal(null);
    expect(area.getAttribute("d")).to.include("Z");
    expect(
      line
        .getAttribute("d")
        .split(" ")
        .map((part) => part[0]),
    ).to.deep.equal(["M", "M"]);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Flow4No data8");
  });

  it("emits rowan-point-activate from an interactive point", async () => {
    const chart = await renderChart({
      interactive: true,
      series: [{ id: "flow", label: "Flow", values: [4, 8] }],
      labels: ["Mon", "Tue"],
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.shadowRoot.querySelector('button[data-point-key="flow::0"]').click();
    await nextMicrotask();

    expect(activations).to.have.length(1);
    expect(activations[0].seriesId).to.equal("flow");
    expect(activations[0].index).to.equal(0);
    expect(activations[0].value).to.equal(4);
  });

  it("does not supply a competing label when the author provides aria-labelledby", async () => {
    const chart = document.createElement("rowan-area-chart");
    chart.label = "Volume";
    chart.setAttribute("aria-labelledby", "volume-heading");
    document.body.append(chart);
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.getAttribute("aria-labelledby")).to.equal("volume-heading");
    expect(chart.internals.ariaLabel).to.equal(null);
  });
});
