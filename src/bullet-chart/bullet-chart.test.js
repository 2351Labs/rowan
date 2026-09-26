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

    const range = chart.shadowRoot.querySelector("rect.range");
    const actual = chart.shadowRoot.querySelector("rect.actual");
    const target = chart.shadowRoot.querySelector("line.target");
    expect(Number(actual.getAttribute("height"))).to.be.below(Number(range.getAttribute("height")));
    expect(Number(actual.getAttribute("y"))).to.be.above(Number(range.getAttribute("y")));
    expect(Number(target.getAttribute("y1"))).to.be.below(Number(actual.getAttribute("y")));
    expect(Number(target.getAttribute("y2"))).to.be.above(
      Number(actual.getAttribute("y")) + Number(actual.getAttribute("height")),
    );
    expect(Number(actual.getAttribute("height"))).to.be.closeTo(
      Number(range.getAttribute("height")) / 3,
      0.05,
    );
    expect(
      [...chart.shadowRoot.querySelectorAll("rect.range")].map((band) =>
        band.getAttribute("data-intensity"),
      ),
    ).to.deep.equal(["40", "25", "10"]);
    expect(chart.shadowRoot.querySelectorAll("line.tick").length).to.be.above(0);
  });

  it("hides ticks when scale is false and reverses ink for intent=lower", async () => {
    const chart = await renderChart({
      value: 82,
      target: 90,
      ranges: [
        { from: 0, to: 60, label: "Poor" },
        { from: 60, to: 80, label: "Fair" },
        { from: 80, to: 100, label: "Good" },
      ],
    });
    chart.scale = false;
    chart.intent = "lower";
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector("line.tick")).to.equal(null);
    expect(
      [...chart.shadowRoot.querySelectorAll("rect.range")].map((band) =>
        band.getAttribute("data-intensity"),
      ),
    ).to.deep.equal(["10", "25", "40"]);
  });

  it("uses range tone hues when encoding is tone", async () => {
    const chart = await renderChart({
      value: 82,
      target: 90,
      ranges: [
        { from: 0, to: 60, label: "Poor", tone: "danger" },
        { from: 60, to: 80, label: "Fair", tone: "warning" },
        { from: 80, to: 100, label: "Good", tone: "success" },
      ],
    });
    expect(chart.encoding).to.equal("ink");
    expect(chart.hasAttribute("encoding")).to.equal(false);

    chart.encoding = "tone";
    await nextMicrotask();
    expect(chart.getAttribute("encoding")).to.equal("tone");
    expect(
      [...chart.shadowRoot.querySelectorAll("rect.range")].map((band) => band.dataset.tone),
    ).to.deep.equal(["danger", "warning", "success"]);

    chart.encoding = "status";
    await nextMicrotask();
    expect(
      [...chart.shadowRoot.querySelectorAll("rect.range")].map((band) => band.dataset.status),
    ).to.deep.equal(["poor", "mid", "good"]);

    chart.encoding = "accent";
    await nextMicrotask();
    expect(chart.encoding).to.equal("accent");
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
    plot.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 12, clientY: 8 }));
    expect(hover.hidden).to.equal(false);
    expect(hover.textContent).to.include("Actual 82");
    expect(hover.textContent).to.include("Target 90");
    expect(hover.textContent).to.include("Good 80–100");

    plot.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    expect(hover.hidden).to.equal(true);
  });
});
