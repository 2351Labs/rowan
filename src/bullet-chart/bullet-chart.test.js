import { expect } from "@esm-bundle/chai";
import "./bullet-chart.js";

const nextMicrotask = () => Promise.resolve();
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

const FILL_RANGES = [
  { from: 0, to: 60, label: "Poor", tone: "danger" },
  { from: 60, to: 80, label: "Fair", tone: "warning" },
  { from: 80, to: 100, label: "Good", tone: "success" },
];

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-bullet-chart");
  if (options.label !== undefined) chart.label = options.label;
  if (options.locale !== undefined) chart.locale = options.locale;
  if (options.value !== undefined) chart.value = options.value;
  if (options.target !== undefined) chart.target = options.target;
  if (options.ranges !== undefined) chart.ranges = options.ranges;
  if (options.messages !== undefined) chart.messages = options.messages;
  if (options.inlineSize) chart.style.inlineSize = options.inlineSize;
  if (options.plotHeight)
    chart.style.setProperty("--rowan-bullet-chart-height", options.plotHeight);
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

async function settleLayout() {
  await nextFrame();
  await nextFrame();
}

function scaleFactor(node) {
  const match = node
    .getAttribute("transform")
    ?.match(/^translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+) 1\)$/);
  return match ? { x: Number(match[1]), y: Number(match[2]), kx: Number(match[3]) } : null;
}

function expectCounterScale(chart) {
  const plot = chart.shadowRoot.querySelector(".plot");
  const box = plot.getBoundingClientRect();
  const expected = (box.height * 100) / (box.width * 28);
  const marks = [...plot.querySelectorAll(".tick, .tick-label")];
  expect(marks.length).to.be.above(0);
  expect(plot.getAttribute("preserveAspectRatio")).to.equal("none");

  for (const node of marks) {
    const scale = scaleFactor(node);
    expect(scale, node.getAttribute("class")).to.not.equal(null);
    expect(scale.kx).to.be.closeTo(expected, 0.002);
    expect(node.dataset.plotX).to.equal(scale.x.toFixed(2));
    expect(node.dataset.plotY).to.equal(scale.y.toFixed(2));
  }

  for (const label of plot.querySelectorAll(".tick-label")) {
    expect(label.getAttribute("x")).to.equal("0");
    expect(label.getAttribute("y")).to.equal("0");
    const ctm = label.getScreenCTM();
    const uniform = box.height / 28;
    expect(ctm.a).to.be.closeTo(uniform, Math.max(0.05, uniform * 0.08));
    expect(Math.abs(ctm.a - ctm.d)).to.be.below(Math.max(0.05, uniform * 0.08));
  }

  for (const tick of plot.querySelectorAll("line.tick")) {
    expect(tick.getAttribute("x1")).to.equal("0");
    expect(tick.getAttribute("x2")).to.equal("0");
    expect(tick.getAttribute("y1")).to.equal("0");
  }

  for (const selector of ["rect.range", "rect.actual", "line.target"]) {
    expect(plot.querySelector(selector).hasAttribute("transform")).to.equal(false);
  }

  return { plot, box, expected };
}

function labelBox(chart, text) {
  const label = [...chart.shadowRoot.querySelectorAll(".tick-label")].find(
    (node) => node.textContent === text,
  );
  expect(label, text).to.exist;
  return label.getBoundingClientRect();
}

function expectAnchoredLabels(chart) {
  const plot = chart.shadowRoot.querySelector(".plot");
  const plotBox = plot.getBoundingClientRect();
  const ticks = [...plot.querySelectorAll("line.tick")];
  const labels = [...plot.querySelectorAll(".tick-label")];
  expect(labels).to.have.length(ticks.length);
  const slack = Math.max(3, plotBox.width * 0.02);

  for (let index = 0; index < labels.length; index += 1) {
    const labelRect = labels[index].getBoundingClientRect();
    const tickRect = ticks[index].getBoundingClientRect();
    const labelCenter = labelRect.left + labelRect.width / 2;
    const tickCenter = tickRect.left + tickRect.width / 2;
    expect(Math.abs(labelCenter - tickCenter), labels[index].textContent).to.be.below(slack);
  }

  const zero = labelBox(chart, "0");
  const hundred = labelBox(chart, "100");
  expect(zero.left + zero.width / 2).to.be.closeTo(plotBox.left + plotBox.width * 0.0125, slack);
  expect(hundred.left + hundred.width / 2).to.be.closeTo(
    plotBox.left + plotBox.width * 0.9875,
    slack,
  );
}

function expectSimilarBox(actual, expected, message) {
  expect(actual.width, `${message} width`).to.be.closeTo(
    expected.width,
    Math.max(1.5, expected.width * 0.35),
  );
  expect(actual.height, `${message} height`).to.be.closeTo(
    expected.height,
    Math.max(1.5, expected.height * 0.35),
  );
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
    expect(chart.shadowRoot.querySelector(".plot").getAttribute("preserveAspectRatio")).to.equal(
      "none",
    );
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

  it("localizes fallback chart copy and values through properties", async () => {
    const chart = await renderChart({
      locale: "de-DE",
      value: 1234.5,
      target: null,
      ranges: [{ from: 0, to: 2000 }],
      messages: {
        actual: "Ist",
        chart: "Aufzählungsdiagramm",
        noData: "Keine Daten",
        range: "Bereich {index}",
        target: "Ziel",
      },
    });
    const formatted = new Intl.NumberFormat("de-DE").format(1234.5);
    const table = chart.shadowRoot.querySelector("table");

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.locale).to.equal("de-DE");
    expect(chart.ranges[0].label).to.equal("Bereich 1");
    expect(chart.internals.ariaLabel).to.equal("Aufzählungsdiagramm");
    expect(table.querySelector("caption").textContent).to.equal("Aufzählungsdiagramm");
    expect(table.textContent).to.include(`Ist${formatted}`);
    expect(table.textContent).to.include("ZielKeine Daten");
  });

  it("keeps tick digits at a uniform aspect on wide and narrow hosts", async () => {
    const height = "48px";
    const shared = {
      label: "Fill rate",
      value: 82,
      target: 90,
      ranges: FILL_RANGES,
      plotHeight: height,
    };
    const uniform = await renderChart({
      ...shared,
      inlineSize: `${(48 * 100) / 28}px`,
    });
    const wide = await renderChart({ ...shared, inlineSize: "640px" });
    const narrow = await renderChart({ ...shared, inlineSize: "128px" });
    await settleLayout();

    const uniformScale = expectCounterScale(uniform);
    const wideScale = expectCounterScale(wide);
    const narrowScale = expectCounterScale(narrow);
    expect(uniformScale.expected).to.be.closeTo(1, 0.05);
    expect(wideScale.expected).to.be.below(0.4);
    expect(narrowScale.expected).to.be.above(1.2);

    for (const text of ["0", "100"]) {
      const reference = labelBox(uniform, text);
      expect(reference.width).to.be.above(0);
      expect(reference.height).to.be.above(0);
      expectSimilarBox(labelBox(wide, text), reference, `wide ${text}`);
      expectSimilarBox(labelBox(narrow, text), reference, `narrow ${text}`);
    }

    const zero = labelBox(uniform, "0");
    const hundred = labelBox(uniform, "100");
    expect(hundred.width).to.be.above(zero.width * 2);
    expect(hundred.width).to.be.below(zero.width * 4);

    for (const chart of [uniform, wide, narrow]) expectAnchoredLabels(chart);

    const widePlot = wide.shadowRoot.querySelector(".plot").getBoundingClientRect();
    const narrowPlot = narrow.shadowRoot.querySelector(".plot").getBoundingClientRect();
    const wideRanges = [...wide.shadowRoot.querySelectorAll("rect.range")].map((band) =>
      band.getBoundingClientRect(),
    );
    const narrowRanges = [...narrow.shadowRoot.querySelectorAll("rect.range")].map((band) =>
      band.getBoundingClientRect(),
    );
    const wideSpan =
      Math.max(...wideRanges.map((band) => band.right)) -
      Math.min(...wideRanges.map((band) => band.left));
    const narrowSpan =
      Math.max(...narrowRanges.map((band) => band.right)) -
      Math.min(...narrowRanges.map((band) => band.left));
    expect(Math.abs(wideSpan / widePlot.width - 0.975)).to.be.below(0.02);
    expect(Math.abs(narrowSpan / narrowPlot.width - 0.975)).to.be.below(0.02);
    expect(wideSpan).to.be.above(narrowSpan * 3);

    const wideTarget = wide.shadowRoot.querySelector("line.target").getScreenCTM();
    const narrowTarget = narrow.shadowRoot.querySelector("line.target").getScreenCTM();
    expect(wideTarget.a).to.be.closeTo(widePlot.width / 100, widePlot.width / 1000);
    expect(narrowTarget.a).to.be.closeTo(narrowPlot.width / 100, narrowPlot.width / 1000);
    expect(wideTarget.a).to.be.above(narrowTarget.a * 3);

    const wideTick = wide.shadowRoot.querySelector("line.tick").getScreenCTM();
    const narrowTick = narrow.shadowRoot.querySelector("line.tick").getScreenCTM();
    expect(wideTick.a).to.be.closeTo(widePlot.height / 28, 0.08);
    expect(narrowTick.a).to.be.closeTo(narrowPlot.height / 28, 0.08);
    expect(Math.abs(wideTick.a - wideTick.d)).to.be.below(0.08);
    expect(Math.abs(narrowTick.a - narrowTick.d)).to.be.below(0.08);
  });

  it("reapplies the label counter-scale after resize, custom height, and re-render", async () => {
    const chart = await renderChart({
      label: "Fill rate",
      value: 82,
      target: 90,
      ranges: FILL_RANGES,
      inlineSize: "320px",
      plotHeight: "48px",
    });
    await settleLayout();
    const initialZero = labelBox(chart, "0");
    const initialHundred = labelBox(chart, "100");
    expectCounterScale(chart);

    chart.style.inlineSize = "640px";
    await settleLayout();
    const wide = expectCounterScale(chart);
    expect(wide.expected).to.be.below(0.4);
    expectAnchoredLabels(chart);
    expectSimilarBox(labelBox(chart, "0"), initialZero, "resized wide 0");
    expectSimilarBox(labelBox(chart, "100"), initialHundred, "resized wide 100");

    chart.style.inlineSize = "8rem";
    chart.style.setProperty("--rowan-bullet-chart-height", "96px");
    await settleLayout();
    const tall = expectCounterScale(chart);
    expect(tall.box.width).to.be.below(wide.box.width / 2);
    expect(tall.expected).to.be.above(1);
    expectAnchoredLabels(chart);
    const tallZero = labelBox(chart, "0");
    expect(tallZero.height).to.be.above(initialZero.height * 1.5);
    expect(tallZero.width).to.be.above(initialZero.width * 1.5);

    chart.value = 70;
    await nextMicrotask();
    await nextMicrotask();
    const rerendered = expectCounterScale(chart);
    expect(rerendered.expected).to.be.closeTo(tall.expected, 0.002);
    expectAnchoredLabels(chart);
    expect(chart.shadowRoot.querySelector(".plot").getAttribute("preserveAspectRatio")).to.equal(
      "none",
    );
    expect(chart.shadowRoot.querySelectorAll(".tick-label").length).to.be.above(1);
  });
});
