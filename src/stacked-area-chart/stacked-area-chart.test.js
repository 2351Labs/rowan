import { expect } from "@esm-bundle/chai";
import "./stacked-area-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-stacked-area-chart");
  chart.label = options.label !== undefined ? options.label : "Incidents";
  if (options.description) chart.description = options.description;
  chart.labels = options.labels ?? ["Mon", "Tue"];
  chart.series = options.series ?? [
    { id: "incoming", label: "Incoming", values: [4, 2] },
    { id: "resolved", label: "Resolved", values: [1, null] },
  ];
  if (options.interactive) chart.interactive = true;
  if (options.stackMode) chart.stackMode = options.stackMode;
  if (options.locale !== undefined) chart.locale = options.locale;
  if (options.referenceLines !== undefined) chart.referenceLines = options.referenceLines;
  if (options.messages !== undefined) chart.messages = options.messages;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-stacked-area-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("stacks positive values and treats null as no-data", async () => {
    const chart = await renderChart();

    expect(chart.hasAttribute("series")).to.equal(false);
    expect(chart.stackMode).to.equal("absolute");
    expect(chart.hasAttribute("stack-mode")).to.equal(false);
    const areas = [...chart.shadowRoot.querySelectorAll("path.series-area")];
    expect(areas).to.have.length(2);
    expect(areas[0].getAttribute("d")).to.include("Z");
    expect(chart.shadowRoot.querySelectorAll("circle.point-marker")).to.have.length(3);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Incoming42");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Resolved1No data");
    expect(chart.shadowRoot.querySelectorAll("button")).to.have.length(0);
  });

  it("keeps default stack geometry when stack-mode is omitted or invalid", async () => {
    const chart = await renderChart();
    const first = chart.shadowRoot.querySelector("path.series-area");
    const geometry = first.getAttribute("d");

    chart.stackMode = "percent";
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.stackMode).to.equal("absolute");
    expect(chart.hasAttribute("stack-mode")).to.equal(false);
    expect(chart.shadowRoot.querySelector("path.series-area").getAttribute("d")).to.equal(geometry);
  });

  it("normalizes each category to 100 and keeps raw values in the table", async () => {
    const chart = await renderChart({
      stackMode: "normalized",
      series: [
        { id: "incoming", label: "Incoming", values: [4, 2] },
        { id: "resolved", label: "Resolved", values: [1, 2] },
      ],
    });
    const tops = [
      ...chart.shadowRoot.querySelectorAll('circle.point-marker[data-point-key^="resolved::"]'),
    ].map((marker) => Number(marker.getAttribute("cy")));
    expect(chart.getAttribute("stack-mode")).to.equal("normalized");
    expect(tops[0]).to.be.closeTo(18, 0.5);
    expect(tops[1]).to.be.closeTo(18, 0.5);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Incoming42");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Resolved12");
  });

  it("does not emit when stack-mode or config changes", async () => {
    const chart = await renderChart();
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.stackMode = "normalized";
    await nextMicrotask();
    await nextMicrotask();
    expect(activations).to.have.length(0);

    chart.config = { labels: chart.labels, series: chart.series };
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.stackMode).to.equal("absolute");
    expect(activations).to.have.length(0);
  });

  it("skips negatives in the stack and table", async () => {
    const chart = await renderChart({
      series: [
        { id: "p1", label: "P1", values: [4, 2] },
        { id: "p2", label: "P2", values: [-3, 1] },
      ],
    });

    expect(chart.shadowRoot.querySelectorAll("circle.point-marker")).to.have.length(3);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("P142");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("P2No data1");
  });

  it("breaks the fill when a series has a gap", async () => {
    const chart = await renderChart({
      labels: ["Mon", "Tue", "Wed"],
      series: [
        { id: "p1", label: "P1", values: [4, null, 2] },
        { id: "p2", label: "P2", values: [1, 3, 1] },
      ],
    });
    const line = chart.shadowRoot.querySelector("path.series-line");
    expect(
      line
        .getAttribute("d")
        .split(" ")
        .map((part) => part[0]),
    ).to.deep.equal(["M", "M"]);
  });

  it("emits rowan-point-activate from an interactive point", async () => {
    const chart = await renderChart({ interactive: true });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.shadowRoot.querySelector('button[data-point-key="incoming::0"]').click();
    await nextMicrotask();

    expect(activations).to.have.length(1);
    expect(activations[0].seriesId).to.equal("incoming");
    expect(activations[0].index).to.equal(0);
    expect(activations[0].value).to.equal(4);
  });

  it("associates the description with the plot", async () => {
    const chart = await renderChart({
      description: "Weekly stack",
    });

    expect(chart.shadowRoot.querySelector(".plot").getAttribute("aria-describedby")).to.equal(
      `${chart.id}__description`,
    );

    chart.description = "";
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector(".plot").hasAttribute("aria-describedby")).to.equal(
      false,
    );
  });

  it("moves keyboard focus when a series id would break a CSS selector", async () => {
    const chart = await renderChart({
      interactive: true,
      labels: ["Mon", "Tue"],
      series: [{ id: 'sales"q', label: "Sales", values: [4, 8] }],
    });
    const buttons = [...chart.shadowRoot.querySelectorAll("button[data-point-key]")];
    buttons[0].focus();
    buttons[0].dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "ArrowRight" }),
    );
    await nextMicrotask();

    expect(chart.shadowRoot.activeElement).to.equal(buttons[1]);
  });

  it("draws reference lines and lists them in the matching table", async () => {
    const chart = await renderChart();
    chart.referenceLines = [{ value: 5, label: "Capacity", tone: "warning" }];
    await nextMicrotask();
    await nextMicrotask();

    const line = chart.shadowRoot.querySelector("g.reference-line-group");
    expect(line).to.not.equal(null);
    expect(line.dataset.refLabel).to.equal("Capacity");
    expect(chart.shadowRoot.querySelector("line.reference-line").dataset.tone).to.equal("warning");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Capacity");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("5");
    expect(chart.hasAttribute("reference-lines")).to.equal(false);
  });

  it("shows the stacked band on hover", async () => {
    const chart = await renderChart();
    const hover = chart.shadowRoot.querySelector(".hover");
    chart.shadowRoot
      .querySelector("path.series-area")
      .dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 24, clientY: 24 }));
    expect(hover.hidden).to.equal(false);
    expect(hover.textContent).to.include("Incoming");
  });

  it("uses locale and property-only messages for generated chart and reference copy", async () => {
    const chart = await renderChart({
      label: "",
      locale: "de-DE",
      labels: ["Mo", "Di"],
      series: [{ id: "flow", label: "Durchsatz", values: [1234.5, null] }],
      referenceLines: [{ value: 2000 }],
      messages: {
        chart: "Gestapeltes Flächendiagramm",
        dataTable: "Datentabelle",
        dataTableCaption: "Tabelle: {chart}",
        metric: "Kennzahl",
        noData: "Keine Daten",
        reference: "Bezugswert",
        series: "Reihen",
      },
    });
    const formatted = new Intl.NumberFormat("de-DE").format(1234.5);
    const table = chart.shadowRoot.querySelector("table");

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.locale).to.equal("de-DE");
    expect(chart.internals.ariaLabel).to.equal("Gestapeltes Flächendiagramm");
    expect(chart.shadowRoot.querySelector(".legend").getAttribute("aria-label")).to.equal("Reihen");
    expect(chart.shadowRoot.querySelector("summary").textContent).to.equal("Datentabelle");
    expect(table.querySelector("caption").textContent).to.equal(
      "Tabelle: Gestapeltes Flächendiagramm",
    );
    expect(table.textContent).to.include(
      `KennzahlMoDiDurchsatz${formatted}Keine DatenBezugswert2.000`,
    );

    const hover = chart.shadowRoot.querySelector(".hover");
    chart.shadowRoot
      .querySelector("g.reference-line-group")
      .dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 24, clientY: 24 }));
    expect(hover.textContent).to.include("Bezugswert");
  });

  it("localizes generated point labels without replacing authored labels", async () => {
    const chart = await renderChart({
      label: "",
      interactive: true,
      labels: [],
      series: [
        {
          id: "incoming",
          label: "Eingehend",
          values: [4, { label: "Point 1", value: 8 }],
        },
      ],
      messages: { point: "Punkt {index}" },
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal("Punkt 1Point 1");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include(
      "MetricPunkt 1Point 1Eingehend48",
    );
    expect(
      chart.shadowRoot
        .querySelector('button[data-point-key="incoming::0"]')
        .getAttribute("aria-label"),
    ).to.include("Punkt 1");

    chart.messages = { point: "Kategorie {index}" };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal("Kategorie 1Point 1");
    expect(activations).to.deep.equal([]);
  });
});
