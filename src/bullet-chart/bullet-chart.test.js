import { expect } from "@esm-bundle/chai";
import "./bullet-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-bullet-chart");
  if (options.label !== undefined) chart.label = options.label;
  if (options.value !== undefined) chart.value = options.value;
  if (options.target !== undefined) chart.target = options.target;
  if (options.ranges !== undefined) chart.ranges = options.ranges;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-bullet-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("draws ranges, actual, and target without serializing data to attributes", async () => {
    const chart = await renderChart({
      label: "Fill rate",
      value: 82,
      target: 90,
      ranges: [
        { from: 0, to: 60, label: "Poor", tone: "danger" },
        { from: 60, to: 80, label: "Fair", tone: "warning" },
        { from: 80, to: 100, label: "Good", tone: "success" },
      ],
    });

    expect(chart.hasAttribute("ranges")).to.equal(false);
    expect(chart.hasAttribute("value")).to.equal(false);
    expect(chart.shadowRoot.querySelectorAll("rect.range")).to.have.length(3);
    expect(chart.shadowRoot.querySelector("rect.actual")).to.not.equal(null);
    expect(chart.shadowRoot.querySelector("line.target")).to.not.equal(null);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Poor0–60");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Actual82");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Target90");
    expect(chart.shadowRoot.querySelectorAll("button")).to.have.length(0);
  });

  it("treats null actual and target as no-data and drops invalid ranges", async () => {
    const chart = await renderChart({
      label: "Fill rate",
      value: null,
      target: null,
      ranges: [
        { from: 80, to: 40, label: "Reversed" },
        { from: 1, to: 1, label: "Empty" },
        { from: "x", to: 10 },
      ],
    });

    expect(chart.ranges).to.deep.equal([{ from: 40, to: 80, label: "Reversed", tone: "neutral" }]);
    expect(chart.shadowRoot.querySelector("rect.actual")).to.equal(null);
    expect(chart.shadowRoot.querySelector("line.target")).to.equal(null);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("ActualNo data");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("TargetNo data");
  });

  it("shows actual, target, and the matching range on hover", async () => {
    const chart = await renderChart({
      label: "Fill rate",
      value: 82,
      target: 90,
      ranges: [
        { from: 0, to: 60, label: "Poor", tone: "danger" },
        { from: 60, to: 80, label: "Fair", tone: "warning" },
        { from: 80, to: 100, label: "Good", tone: "success" },
      ],
    });

    const plot = chart.shadowRoot.querySelector(".plot");
    const hover = chart.shadowRoot.querySelector(".hover");
    const plotBox = plot.getBoundingClientRect();
    plot.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: plotBox.left + plotBox.width / 2,
        clientY: plotBox.top + 8,
      }),
    );
    expect(hover.hidden).to.equal(false);
    expect(hover.textContent).to.include("Actual 82");
    expect(hover.textContent).to.include("Target 90");
    expect(hover.textContent).to.include("Good 80–100");
    const hoverBox = hover.getBoundingClientRect();
    expect(hoverBox.top).to.be.at.least(plotBox.top - 72);
    expect(hoverBox.top).to.be.at.most(plotBox.bottom + 72);

    plot.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    expect(hover.hidden).to.equal(true);
  });
});
