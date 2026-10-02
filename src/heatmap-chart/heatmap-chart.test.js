import { expect } from "@esm-bundle/chai";
import {
  assertPointControlAlignment,
  assertPointControlKeyboardNavigation,
  assertPointControlLifecycle,
} from "../../test/chart-interactions.js";
import "./heatmap-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-heatmap-chart");
  chart.label = options.label !== undefined ? options.label : "Lane dwell";
  if (options.rows) chart.rows = options.rows;
  if (options.columns) chart.columns = options.columns;
  if (options.values) chart.values = options.values;
  if (options.points) chart.points = options.points;
  if (options.interactive) chart.interactive = true;
  if (options.locale !== undefined) chart.locale = options.locale;
  if (options.messages !== undefined) chart.messages = options.messages;
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

  it("moves keyboard focus between named point controls", async () => {
    const chart = await renderChart({
      interactive: true,
      rows: ["North"],
      columns: ["Mon", "Tue"],
      values: [[4, 8]],
    });
    await assertPointControlKeyboardNavigation(chart);
  });

  it("keeps an overlay hit target on its SVG cell in LTR and RTL hosts", async () => {
    const chart = await renderChart({
      interactive: true,
      rows: ["North"],
      columns: ["Mon"],
      values: [[4]],
    });
    await assertPointControlAlignment({
      chart,
      pointSelector: "rect.cell",
      pointKey: "0::0",
    });
  });

  it("restores point focus after rerender and hides hover after reconnects", async () => {
    const chart = await renderChart({
      interactive: true,
      rows: ["North"],
      columns: ["Mon"],
      values: [[4]],
    });
    await assertPointControlLifecycle({
      chart,
      rerender: () => {
        chart.values = chart.values.map((row) => [...row]);
      },
      markSelector: "rect.cell",
    });
  });

  it("uses locale and property-only messages for generated chart copy", async () => {
    const chart = await renderChart({
      label: "",
      locale: "de-DE",
      rows: ["Nord"],
      columns: ["Mo", "Di"],
      values: [[1234.5, null]],
      messages: {
        chart: "Heatmap",
        dataTable: "Datentabelle",
        dataTableCaption: "Tabelle: {chart}",
        noData: "Keine Daten",
      },
    });
    const formatted = new Intl.NumberFormat("de-DE").format(1234.5);
    const table = chart.shadowRoot.querySelector("table");
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.messages = { ...chart.messages, chart: "Aktualisierte Heatmap" };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.locale).to.equal("de-DE");
    expect(chart.internals.ariaLabel).to.equal("Aktualisierte Heatmap");
    expect(chart.shadowRoot.querySelector("summary").textContent).to.equal("Datentabelle");
    expect(table.querySelector("caption").textContent).to.equal("Tabelle: Aktualisierte Heatmap");
    expect(table.textContent).to.include(`MoDiNord${formatted}Keine Daten`);
    expect(activations).to.have.length(0);
  });

  it("localizes generated row and column labels without replacing authored labels", async () => {
    const chart = await renderChart({
      label: "",
      interactive: true,
      rows: ["", "Row 1"],
      columns: ["", "Column 1"],
      values: [
        [4, 8],
        [12, 16],
      ],
      messages: {
        row: "Zeile {index}",
        column: "Spalte {index}",
      },
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.shadowRoot.querySelector(".y-axis").textContent).to.equal("Zeile 1Row 1");
    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal("Spalte 1Column 1");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Zeile 1");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Spalte 1");
    expect(
      chart.shadowRoot.querySelector('button[data-point-key="0::0"]').getAttribute("aria-label"),
    ).to.equal("Zeile 1, Spalte 1, 4");

    chart.config = { ...chart.config, interactive: true };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector(".y-axis").textContent).to.equal("Zeile 1Row 1");
    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal("Spalte 1Column 1");

    const config = chart.config;
    config.rows[0] = "Eigene Zeile";
    config.columns[0] = "Eigene Spalte";
    chart.config = config;
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector(".y-axis").textContent).to.equal("Eigene ZeileRow 1");
    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal("Eigene SpalteColumn 1");

    chart.messages = { row: "Reihe {index}", column: "Kategorie {index}" };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector(".y-axis").textContent).to.equal("Eigene ZeileRow 1");
    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal("Eigene SpalteColumn 1");
    expect(activations).to.deep.equal([]);
  });
});
