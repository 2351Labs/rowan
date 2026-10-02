import { expect } from "@esm-bundle/chai";
import "./area-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-area-chart");
  chart.label = options.label !== undefined ? options.label : "Volume";
  chart.labels = options.labels ?? ["Mon", "Tue", "Wed"];
  chart.series = options.series ?? [{ id: "flow", label: "Flow", values: [4, null, 8] }];
  if (options.interactive) chart.interactive = true;
  if (options.locale !== undefined) chart.locale = options.locale;
  if (options.referenceLines !== undefined) chart.referenceLines = options.referenceLines;
  if (options.messages !== undefined) chart.messages = options.messages;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-area-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("fills under the line and breaks the fill on null values", async () => {
    const chart = await renderChart();

    expect(chart.hasAttribute("series")).to.equal(false);
    const area = chart.shadowRoot.querySelector("path.series-area");
    const line = chart.shadowRoot.querySelector("path.series-line");
    expect(area).to.not.equal(null);
    expect(area.getAttribute("d")).to.include("Z");
    expect(
      line
        .getAttribute("d")
        .split(" ")
        .map((part) => part[0]),
    ).to.deep.equal(["M", "M"]);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Flow4No data8");
  });

  it("emits rowan-point-activate from an interactive point", async () => {
    const chart = await renderChart({
      interactive: true,
      series: [{ id: "flow", label: "Flow", values: [4, 8] }],
      labels: ["Mon", "Tue"],
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.shadowRoot.querySelector('button[data-point-key="flow::0"]').click();
    await nextMicrotask();

    expect(activations).to.have.length(1);
    expect(activations[0].seriesId).to.equal("flow");
    expect(activations[0].index).to.equal(0);
    expect(activations[0].value).to.equal(4);
  });

  it("does not supply a competing label when the author provides aria-labelledby", async () => {
    const chart = document.createElement("rowan-area-chart");
    chart.label = "Volume";
    chart.setAttribute("aria-labelledby", "volume-heading");
    document.body.append(chart);
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.getAttribute("aria-labelledby")).to.equal("volume-heading");
    expect(chart.internals.ariaLabel).to.equal(null);
  });

  it("draws reference lines and lists them in the matching table", async () => {
    const chart = await renderChart();
    chart.referenceLines = [{ value: 6, label: "Target", tone: "danger" }];
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector("g.reference-line-group")).to.not.equal(null);
    expect(chart.shadowRoot.querySelector("line.reference-line").dataset.tone).to.equal("danger");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Target");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("6");
    expect(chart.hasAttribute("reference-lines")).to.equal(false);
  });

  it("shows the reference line on hover", async () => {
    const chart = await renderChart();
    chart.referenceLines = [{ value: 6, label: "Target", tone: "danger" }];
    await nextMicrotask();
    await nextMicrotask();

    const hover = chart.shadowRoot.querySelector(".hover");
    chart.shadowRoot
      .querySelector("g.reference-line-group")
      .dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 24, clientY: 24 }));
    expect(hover.hidden).to.equal(false);
    expect(hover.textContent).to.include("Target");
    expect(hover.textContent).to.include("6");

    chart.shadowRoot
      .querySelector(".chart")
      .dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    expect(hover.hidden).to.equal(true);
  });

  it("expands the value domain for a reference line outside the series range", async () => {
    const chart = await renderChart();
    chart.referenceLines = [{ value: 20, label: "Ceiling" }];
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector(".axis-y-label").textContent).to.equal("20");
    expect(
      Number(chart.shadowRoot.querySelector("line.reference-line").getAttribute("y1")),
    ).to.equal(Number(chart.shadowRoot.querySelector(".grid line").getAttribute("y1")));
  });

  it("uses locale and property-only messages for generated chart and reference copy", async () => {
    const chart = await renderChart({
      label: "",
      locale: "de-DE",
      labels: ["Mo", "Di"],
      series: [{ id: "flow", label: "Durchsatz", values: [1234.5, null] }],
      referenceLines: [{ value: 2000 }],
      messages: {
        chart: "Flächendiagramm",
        dataTable: "Datentabelle",
        dataTableCaption: "Tabelle: {chart}",
        metric: "Kennzahl",
        noData: "Keine Daten",
        noMetricData: "Keine Messdaten",
        reference: "Bezugswert",
        series: "Reihen",
      },
    });
    const formatted = new Intl.NumberFormat("de-DE").format(1234.5);
    const table = chart.shadowRoot.querySelector("table");

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.locale).to.equal("de-DE");
    expect(chart.internals.ariaLabel).to.equal("Flächendiagramm");
    expect(chart.shadowRoot.querySelector(".plot").getAttribute("aria-label")).to.equal(
      "Flächendiagramm",
    );
    expect(chart.shadowRoot.querySelector(".legend").getAttribute("aria-label")).to.equal("Reihen");
    expect(chart.shadowRoot.querySelector("summary").textContent).to.equal("Datentabelle");
    expect(table.querySelector("caption").textContent).to.equal("Tabelle: Flächendiagramm");
    expect(table.textContent).to.include(
      `KennzahlMoDiDurchsatz${formatted}Keine DatenBezugswert2.000`,
    );

    const hover = chart.shadowRoot.querySelector(".hover");
    chart.shadowRoot
      .querySelector("g.reference-line-group")
      .dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 24, clientY: 24 }));
    expect(hover.textContent).to.include("Bezugswert");

    chart.series = [];
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.shadowRoot.querySelector(".empty-label").textContent).to.equal("Keine Messdaten");
  });

  it("localizes generated point labels without replacing authored labels", async () => {
    const chart = await renderChart({
      label: "",
      interactive: true,
      labels: [],
      series: [
        {
          id: "flow",
          label: "Durchsatz",
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
      "MetricPunkt 1Point 1Durchsatz48",
    );
    expect(
      chart.shadowRoot.querySelector('button[data-point-key="flow::0"]').getAttribute("aria-label"),
    ).to.include("Punkt 1");

    chart.config = { ...chart.config, interactive: true };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal("Punkt 1Point 1");

    chart.messages = { point: "Kategorie {index}" };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal("Kategorie 1Point 1");
    expect(activations).to.deep.equal([]);
  });
});
