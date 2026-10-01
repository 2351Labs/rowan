import { expect } from "@esm-bundle/chai";
import {
  assertPointControlAlignment,
  assertPointControlKeyboardNavigation,
  assertPointControlLifecycle,
} from "../../test/chart-interactions.js";
import "./scatter-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-scatter-chart");
  chart.label = options.label !== undefined ? options.label : "Fill vs dwell";
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
  if (options.locale !== undefined) chart.locale = options.locale;
  if (options.messages !== undefined) chart.messages = options.messages;
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
    expect(radii[0]).to.equal(4);
    expect(radii[1]).to.equal(18);
    expect(radii[1]).to.be.above(radii[0]);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Size");
  });

  it("keeps omitted size as a scatter radius when siblings encode size", async () => {
    const chart = await renderChart({
      series: [
        {
          id: "a",
          label: "A",
          points: [
            { x: 1, y: 1, label: "plain" },
            { x: 2, y: 2, size: 10, label: "bubble" },
          ],
        },
      ],
    });
    const radii = [...chart.shadowRoot.querySelectorAll("circle.point")].map((mark) =>
      Number(mark.getAttribute("r")),
    );
    expect(radii[0]).to.equal(5);
    expect(radii[1]).to.be.at.least(4);
    expect(radii[1]).to.be.at.most(18);
  });

  it("emits rowan-point-activate from an interactive point only", async () => {
    const chart = await renderChart({ interactive: true });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));
    chart.series = [...chart.series];
    await nextMicrotask();
    await nextMicrotask();
    expect(activations).to.have.length(0);

    const first = chart.shadowRoot.querySelector('button[data-point-key="a::0"]');
    expect(first.getAttribute("aria-label")).to.equal("Lane A, P1, x=1, y=4");
    first.click();
    await nextMicrotask();
    expect(activations).to.have.length(1);
    expect(activations[0].seriesId).to.equal("a");
    expect(activations[0].x).to.equal(1);
    expect(activations[0].y).to.equal(4);
    expect(activations[0].size).to.equal(null);
    expect(activations[0].formattedValue).to.equal("x=1, y=4");
    expect(activations[0]).to.not.have.property("plotX");

    chart.shadowRoot.querySelector('button[data-point-key="a::2"]').click();
    await nextMicrotask();
    expect(activations[1].x).to.equal(3);
    expect(activations[1].y).to.equal(6);
    expect(activations[1].size).to.equal(10);
    expect(activations[1].formattedValue).to.equal("x=3, y=6, size=10");
  });

  it("moves keyboard focus between named point controls", async () => {
    const chart = await renderChart({ interactive: true });
    await assertPointControlKeyboardNavigation(chart);
  });

  it("keeps an overlay hit target on its SVG point in LTR and RTL hosts", async () => {
    const chart = await renderChart({ interactive: true });
    await assertPointControlAlignment({
      chart,
      pointSelector: "circle.point",
      pointKey: "a::0",
      alignment: "center",
    });
  });

  it("restores point focus after rerender and hides hover after reconnects", async () => {
    const chart = await renderChart({ interactive: true });
    await assertPointControlLifecycle({
      chart,
      rerender: () => {
        chart.series = [...chart.series];
      },
      markSelector: "circle.point",
    });
  });

  it("uses locale and property-only messages for generated chart copy", async () => {
    const chart = await renderChart({
      label: "",
      locale: "de-DE",
      interactive: true,
      series: [
        {
          id: "north",
          label: "Nord",
          points: [
            { x: 1234.5, y: 6.5, label: "Punkt A" },
            { x: 2, y: 8, size: 10.5, label: "Punkt B" },
          ],
        },
      ],
      messages: {
        chart: "Streudiagramm",
        dataTable: "Datentabelle",
        dataTableCaption: "Tabelle: {chart}",
        noData: "Keine Daten",
        point: "Punkt",
        series: "Reihen",
        size: "Größe",
        sizeValue: "Größe",
        x: "X-Wert",
        xValue: "X-Wert",
        y: "Y-Wert",
        yValue: "Y-Wert",
      },
    });
    const formatted = new Intl.NumberFormat("de-DE").format(1234.5);
    const table = chart.shadowRoot.querySelector("table");
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.messages = { ...chart.messages, chart: "Aktualisiertes Streudiagramm" };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.locale).to.equal("de-DE");
    expect(chart.internals.ariaLabel).to.equal("Aktualisiertes Streudiagramm");
    expect(chart.shadowRoot.querySelector(".legend").getAttribute("aria-label")).to.equal("Reihen");
    expect(chart.shadowRoot.querySelector("summary").textContent).to.equal("Datentabelle");
    expect(table.querySelector("caption").textContent).to.equal(
      "Tabelle: Aktualisiertes Streudiagramm",
    );
    expect(table.textContent).to.include(`ReihenPunktX-WertY-WertGrößeNordPunkt A${formatted}`);
    expect(table.textContent).to.include("Keine Daten");
    expect(
      chart.shadowRoot
        .querySelector('button[data-point-key="north::0"]')
        .getAttribute("aria-label"),
    ).to.include(`X-Wert=${formatted}`);
    expect(activations).to.have.length(0);
  });

  it("localizes generated point labels without replacing authored labels", async () => {
    const chart = await renderChart({
      label: "",
      interactive: true,
      series: [
        {
          id: "north",
          label: "Nord",
          points: [
            { x: 1, y: 4 },
            { x: 2, y: 8, label: "Point 1" },
          ],
        },
      ],
      messages: {
        point: "Punkt",
        pointLabel: "Punkt {index}",
      },
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("SeriesPunktXY");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("NordPunkt 1");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Point 1");
    expect(
      chart.shadowRoot
        .querySelector('button[data-point-key="north::0"]')
        .getAttribute("aria-label"),
    ).to.include("Punkt 1");

    chart.messages = { point: "Punkt", pointLabel: "Kategorie {index}" };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector("table").textContent).to.include("NordKategorie 1");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Point 1");
    expect(activations).to.deep.equal([]);
  });
});
