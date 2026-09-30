import { expect } from "@esm-bundle/chai";
import "./heatmap-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-heatmap-chart");
  chart.label = options.label ?? "Lane dwell";
  if (options.rows) chart.rows = options.rows;
  if (options.columns) chart.columns = options.columns;
  if (options.values) chart.values = options.values;
  if (options.points) chart.points = options.points;
  if (options.interactive) chart.interactive = true;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-heatmap-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("draws a matrix, skips null cells, and does not reflect values", async () => {
    const chart = await renderChart({
      rows: ["North", "South"],
      columns: ["Mon", "Tue"],
      values: [
        [4, null],
        [1, 9],
      ],
    });

    expect(chart.hasAttribute("values")).to.equal(false);
    expect(chart.hasAttribute("rows")).to.equal(false);
    expect(chart.shadowRoot.querySelectorAll("rect.cell")).to.have.length(3);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("North");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("No data");
    const opacities = [...chart.shadowRoot.querySelectorAll("rect.cell")].map((cell) =>
      Number(cell.getAttribute("fill-opacity")),
    );
    expect(opacities.at(-1)).to.be.above(opacities[0]);
  });

  it("accepts { x, y, value } points in appearance order", async () => {
    const chart = await renderChart({
      points: [
        { x: "Tue", y: "South", value: 8 },
        { x: "Mon", y: "North", value: 2 },
        { row: "South", column: "Mon", value: null },
      ],
    });

    expect(chart.rows).to.deep.equal(["South", "North"]);
    expect(chart.columns).to.deep.equal(["Tue", "Mon"]);
    expect(chart.shadowRoot.querySelectorAll("rect.cell")).to.have.length(2);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("No data");
  });

  it("emits rowan-point-activate from an interactive cell only", async () => {
    const chart = await renderChart({
      interactive: true,
      rows: ["North"],
      columns: ["Mon"],
      values: [[4]],
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));
    chart.values = chart.values.map((row) => [...row]);
    await nextMicrotask();
    await nextMicrotask();
    expect(activations).to.have.length(0);

    chart.shadowRoot.querySelector('button[data-point-key="0::0"]').click();
    await nextMicrotask();
    expect(activations).to.have.length(1);
    expect(activations[0].row).to.equal("North");
    expect(activations[0].column).to.equal("Mon");
    expect(activations[0].value).to.equal(4);
    expect(activations[0].rowIndex).to.equal(0);
    expect(activations[0].columnIndex).to.equal(0);
  });
});
