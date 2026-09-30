import { expect } from "@esm-bundle/chai";
import "./scatter-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-scatter-chart");
  chart.label = options.label ?? "Fill vs dwell";
  chart.series = options.series ?? [
    {
      id: "a",
      label: "Lane A",
      points: [
        { x: 1, y: 4, label: "P1" },
        { x: null, y: 8, label: "Gap" },
        { x: 3, y: 6, size: 10, label: "P3" },
      ],
    },
  ];
  if (options.interactive) chart.interactive = true;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-scatter-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("skips null x or y and does not reflect series", async () => {
    const chart = await renderChart();
    expect(chart.hasAttribute("series")).to.equal(false);
    expect(chart.shadowRoot.querySelectorAll("circle.point")).to.have.length(2);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Lane A");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("P1");
    expect(chart.shadowRoot.querySelector("table").textContent).to.not.include("Gap");
  });

  it("encodes size as bubble radius", async () => {
    const chart = await renderChart({
      series: [
        {
          id: "a",
          label: "A",
          points: [
            { x: 1, y: 1, size: 1, label: "small" },
            { x: 2, y: 2, size: 9, label: "large" },
          ],
        },
      ],
    });
    const radii = [...chart.shadowRoot.querySelectorAll("circle.point")].map((mark) =>
      Number(mark.getAttribute("r")),
    );
    expect(radii[1]).to.be.above(radii[0]);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Size");
  });

  it("emits rowan-point-activate from an interactive point only", async () => {
    const chart = await renderChart({ interactive: true });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));
    chart.series = [...chart.series];
    await nextMicrotask();
    await nextMicrotask();
    expect(activations).to.have.length(0);

    chart.shadowRoot.querySelector('button[data-point-key="a::0"]').click();
    await nextMicrotask();
    expect(activations).to.have.length(1);
    expect(activations[0].seriesId).to.equal("a");
    expect(activations[0].x).to.equal(1);
    expect(activations[0].y).to.equal(4);
  });
});
