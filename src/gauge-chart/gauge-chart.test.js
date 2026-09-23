import { expect } from "@esm-bundle/chai";
import "./gauge-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-gauge-chart");
  if (options.label !== undefined) chart.label = options.label;
  if (options.min !== undefined) chart.min = options.min;
  if (options.max !== undefined) chart.max = options.max;
  if (options.value !== undefined) chart.value = options.value;
  if (options.target !== undefined) chart.target = options.target;
  if (options.ranges !== undefined) chart.ranges = options.ranges;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-gauge-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("draws range bands, a needle, and a target without serializing series data", async () => {
    const chart = await renderChart({
      label: "Utilization",
      min: 0,
      max: 100,
      value: 72,
      target: 80,
      ranges: [
        { from: 0, to: 50, label: "Low", tone: "danger" },
        { from: 50, to: 80, label: "Fair", tone: "warning" },
        { from: 80, to: 100, label: "Good", tone: "success" },
      ],
    });

    expect(chart.hasAttribute("ranges")).to.equal(false);
    expect(chart.hasAttribute("value")).to.equal(false);
    expect(chart.getAttribute("min")).to.equal("0");
    expect(chart.getAttribute("max")).to.equal("100");
    expect(chart.shadowRoot.querySelectorAll("path.range")).to.have.length(3);
    expect(chart.shadowRoot.querySelector("line.needle")).to.not.equal(null);
    expect(chart.shadowRoot.querySelector("line.target")).to.not.equal(null);
    expect(chart.shadowRoot.querySelector("text.readout").textContent).to.equal("72");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Minimum0");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Actual72");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Target80");
  });

  it("hides the needle when value is null and drops invalid ranges", async () => {
    const chart = await renderChart({
      value: null,
      target: null,
      ranges: [
        { from: 90, to: 40, label: "Reversed" },
        { from: 1, to: 1 },
      ],
    });

    expect(chart.ranges).to.deep.equal([{ from: 40, to: 90, label: "Reversed", tone: "neutral" }]);
    expect(chart.shadowRoot.querySelector("line.needle")).to.equal(null);
    expect(chart.shadowRoot.querySelector("text.readout").textContent).to.equal("—");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("ActualNo data");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("TargetNo data");
  });

  it("uses min and max for the scale, clamps the needle, and keeps wide bands on the semicircle", async () => {
    const chart = await renderChart({
      min: 10,
      max: 20,
      value: 25,
      target: 5,
      ranges: [{ from: 10, to: 18, label: "Most", tone: "warning" }],
    });

    expect(chart.getAttribute("min")).to.equal("10");
    expect(chart.getAttribute("max")).to.equal("20");
    expect(chart.internals.role).to.equal("meter");
    expect(chart.internals.ariaValueMin).to.equal("10");
    expect(chart.internals.ariaValueMax).to.equal("20");
    expect(chart.internals.ariaValueNow).to.equal("25");
    expect(chart.shadowRoot.querySelectorAll("text.tick-label")[0].textContent).to.equal("10");
    expect(chart.shadowRoot.querySelectorAll("text.tick-label")[1].textContent).to.equal("20");
    expect(chart.shadowRoot.querySelector("text.readout").textContent).to.equal("25");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Actual25");
    expect(chart.shadowRoot.querySelector("line.needle").getAttribute("x2")).to.equal("176.00");
    const rangePath = chart.shadowRoot.querySelector("path.range").getAttribute("d");
    expect(rangePath.startsWith("M24.00,100.00")).to.equal(true);
    expect(rangePath).to.include(" L");
    expect(rangePath).to.not.match(/ A/);
  });

  it("falls back to 0–100 when max is not greater than min", async () => {
    const chart = await renderChart({ min: 40, max: 40, value: 10 });
    expect(chart.shadowRoot.querySelectorAll("text.tick-label")[0].textContent).to.equal("0");
    expect(chart.shadowRoot.querySelectorAll("text.tick-label")[1].textContent).to.equal("100");
  });
});
