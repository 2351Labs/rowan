import { expect } from "@esm-bundle/chai";
import "./funnel-chart.js";

const nextMicrotask = () => Promise.resolve();

function pathY(path) {
  return Number(path.getAttribute("d").match(/M[\d.-]+,([\d.-]+)/)?.[1] ?? 0);
}

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-funnel-chart");
  chart.label = options.label !== undefined ? options.label : "Conversion";
  chart.labels = options.labels ?? ["Leads", "Qualified", "Won"];
  chart.series = options.series ?? [{ id: "flow", label: "Flow", values: [10, 40, null, 20] }];
  if (options.interactive) chart.interactive = true;
  if (options.variant) chart.variant = options.variant;
  if (options.locale !== undefined) chart.locale = options.locale;
  if (options.messages !== undefined) chart.messages = options.messages;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-funnel-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("keeps input order, skips null and negatives, and does not reflect series", async () => {
    const chart = await renderChart({
      labels: ["Leads", "Qualified", "Spam", "Won"],
      series: [{ id: "flow", label: "Flow", values: [10, 40, -3, 20] }],
    });

    expect(chart.variant).to.equal("funnel");
    expect(chart.hasAttribute("variant")).to.equal(false);
    expect(chart.hasAttribute("series")).to.equal(false);
    const stages = [...chart.shadowRoot.querySelectorAll("path.stage")];
    expect(stages).to.have.length(3);
    expect(pathY(stages[0])).to.be.below(pathY(stages[1]));
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Flow10");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("No data");
    expect(chart.shadowRoot.querySelector("table").textContent).to.match(/10.*40.*No data.*20/);
  });

  it("keeps finite 0 as a stage and does not divide by zero", async () => {
    const chart = await renderChart({
      labels: ["Leads", "None", "Won"],
      series: [{ id: "flow", label: "Flow", values: [10, 0, 4] }],
    });
    expect(chart.shadowRoot.querySelectorAll("path.stage")).to.have.length(3);
    expect(chart.shadowRoot.querySelector("table").textContent).to.match(/10.*0.*4/);
    expect(chart.shadowRoot.querySelector("table").textContent).to.not.include("No data");

    chart.remove();
    const zeros = await renderChart({
      labels: ["A", "B"],
      series: [{ id: "flow", label: "Flow", values: [0, 0] }],
    });
    const stages = [...zeros.shadowRoot.querySelectorAll("path.stage")];
    expect(stages).to.have.length(2);
    for (const stage of stages) {
      expect(stage.getAttribute("d")).to.not.match(/NaN/);
    }
  });

  it("puts stage 0 at the bottom for pyramid and tapers cone", async () => {
    const pyramid = await renderChart({ variant: "pyramid" });
    const first = pyramid.shadowRoot.querySelector('path[data-point-key="flow::0"]');
    const last = pyramid.shadowRoot.querySelector('path[data-point-key="flow::3"]');
    expect(pathY(first)).to.be.above(pathY(last));

    pyramid.remove();
    const cone = await renderChart({
      variant: "cone",
      labels: ["A", "B"],
      series: [{ id: "flow", label: "Flow", values: [10, 4] }],
    });
    const tip = cone.shadowRoot.querySelector('path[data-point-key="flow::1"]').getAttribute("d");
    expect(tip).to.match(/L515\.00,/);
  });

  it("does not emit when variant is set, and omitted config variant resets", async () => {
    const chart = await renderChart({ variant: "pyramid" });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.variant = "spiral";
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.variant).to.equal("funnel");
    expect(chart.hasAttribute("variant")).to.equal(false);
    expect(activations).to.have.length(0);

    chart.variant = "cone";
    chart.config = { labels: chart.labels, series: chart.series };
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.variant).to.equal("funnel");
    expect(activations).to.have.length(0);
  });

  it("emits rowan-point-activate from an interactive stage", async () => {
    const chart = await renderChart({
      interactive: true,
      labels: ["Leads", "Won"],
      series: [{ id: "flow", label: "Flow", values: [10, 4] }],
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));
    chart.shadowRoot.querySelector('button[data-point-key="flow::0"]').click();
    await nextMicrotask();
    expect(activations[0].seriesId).to.equal("flow");
    expect(activations[0].label).to.equal("Leads");
    expect(activations[0].value).to.equal(10);
  });

  it("uses locale and property-only messages for generated chart copy", async () => {
    const chart = await renderChart({
      label: "",
      locale: "de-DE",
      labels: ["Besuche", "Käufe"],
      series: [{ id: "flow", label: "Pfad", values: [1234.5, null] }],
      messages: {
        chart: "Trichterdiagramm",
        dataTable: "Datentabelle",
        dataTableCaption: "Tabelle: {chart}",
        metric: "Kennzahl",
        noData: "Keine Daten",
        stages: "Stufen",
      },
    });
    const formatted = new Intl.NumberFormat("de-DE").format(1234.5);
    const table = chart.shadowRoot.querySelector("table");
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.messages = { ...chart.messages, chart: "Neues Trichterdiagramm" };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.locale).to.equal("de-DE");
    expect(chart.internals.ariaLabel).to.equal("Neues Trichterdiagramm");
    expect(chart.shadowRoot.querySelector(".legend").getAttribute("aria-label")).to.equal("Stufen");
    expect(chart.shadowRoot.querySelector("summary").textContent).to.equal("Datentabelle");
    expect(table.querySelector("caption").textContent).to.equal("Tabelle: Neues Trichterdiagramm");
    expect(table.textContent).to.include(`KennzahlBesucheKäufePfad${formatted}Keine Daten`);
    expect(activations).to.have.length(0);
  });

  it("localizes generated stage labels without replacing authored labels", async () => {
    const chart = await renderChart({
      label: "",
      interactive: true,
      labels: [],
      series: [
        {
          id: "flow",
          label: "Pfad",
          values: [4, { label: "Point 1", value: 8 }],
        },
      ],
      messages: { point: "Punkt {index}" },
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.shadowRoot.querySelector(".y-axis").textContent).to.equal("Punkt 1Point 1");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include(
      "MetricPunkt 1Point 1Pfad48",
    );
    expect(
      chart.shadowRoot.querySelector('button[data-point-key="flow::0"]').getAttribute("aria-label"),
    ).to.include("Punkt 1");

    chart.messages = { point: "Kategorie {index}" };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector(".y-axis").textContent).to.equal("Kategorie 1Point 1");
    expect(activations).to.deep.equal([]);
  });
});
