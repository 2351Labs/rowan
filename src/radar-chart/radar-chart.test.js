import { expect } from "@esm-bundle/chai";
import "./radar-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-radar-chart");
  chart.label = options.label ?? "Yard profile";
  chart.labels = options.labels ?? ["Fill", "Dwell", "Damage", "OTD"];
  chart.series = options.series ?? [
    { id: "north", label: "North", values: [80, 40, null, 70] },
    { id: "south", label: "South", values: [60, 55, 20, 90] },
  ];
  if (options.interactive) chart.interactive = true;
  if (options.geometry) chart.geometry = options.geometry;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-radar-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("skips null, keeps 0, and does not reflect series", async () => {
    const chart = await renderChart({
      labels: ["Fill", "Dwell", "Idle"],
      series: [{ id: "north", label: "North", values: [80, 0, null] }],
    });
    expect(chart.geometry).to.equal("line");
    expect(chart.hasAttribute("geometry")).to.equal(false);
    expect(chart.hasAttribute("series")).to.equal(false);
    expect(chart.shadowRoot.querySelectorAll("circle.point")).to.have.length(2);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("North");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("No data");
    expect(chart.shadowRoot.querySelector("table").textContent).to.match(/80.*0.*No data/);

    const first = chart.shadowRoot.querySelector('circle[data-point-key="north::0"]');
    const zero = chart.shadowRoot.querySelector('circle[data-point-key="north::1"]');
    expect(Number(first.getAttribute("cx"))).to.be.closeTo(500, 1);
    expect(Number(first.getAttribute("cy"))).to.be.below(500);
    expect(Number(zero.getAttribute("cx"))).to.be.closeTo(500, 1);
    expect(Number(zero.getAttribute("cy"))).to.be.closeTo(500, 1);
  });

  it("fills a complete ring for area and omitted config geometry resets to line", async () => {
    const chart = await renderChart({
      geometry: "area",
      labels: ["A", "B", "C"],
      series: [{ id: "north", label: "North", values: [8, 5, 6] }],
    });
    expect(chart.geometry).to.equal("area");
    expect(chart.shadowRoot.querySelectorAll("path.series-area")).to.have.length(1);
    expect(chart.shadowRoot.querySelector("path.series-area").getAttribute("d")).to.match(/Z/);
    expect(chart.shadowRoot.querySelectorAll("circle.point")).to.have.length(3);

    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));
    chart.geometry = "nightingale";
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.geometry).to.equal("line");
    expect(chart.hasAttribute("geometry")).to.equal(false);
    expect(activations).to.have.length(0);

    chart.geometry = "area";
    chart.config = { labels: chart.labels, series: chart.series };
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.geometry).to.equal("line");
    expect(chart.shadowRoot.querySelectorAll("path.series-area")).to.have.length(0);
    expect(activations).to.have.length(0);
  });

  it("does not fill across a null axis", async () => {
    const chart = await renderChart({
      geometry: "area",
      labels: ["A", "B", "C"],
      series: [{ id: "north", label: "North", values: [8, null, 6] }],
    });
    expect(chart.shadowRoot.querySelectorAll("path.series-area")).to.have.length(0);
    expect(chart.shadowRoot.querySelector("path.series-line").getAttribute("d")).to.not.match(/Z$/);
    expect(chart.shadowRoot.querySelectorAll("circle.point")).to.have.length(2);
  });

  it("emits rowan-point-activate from an interactive vertex", async () => {
    const chart = await renderChart({
      interactive: true,
      labels: ["Fill", "Dwell"],
      series: [{ id: "north", label: "North", values: [80, 40] }],
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));
    chart.series = [...chart.series];
    await nextMicrotask();
    await nextMicrotask();
    expect(activations).to.have.length(0);

    chart.shadowRoot.querySelector('button[data-point-key="north::0"]').click();
    await nextMicrotask();
    expect(activations).to.have.length(1);
    expect(activations[0].seriesId).to.equal("north");
    expect(activations[0].label).to.equal("Fill");
    expect(activations[0].value).to.equal(80);
    expect(activations[0]).to.not.have.property("plotX");
  });
});
