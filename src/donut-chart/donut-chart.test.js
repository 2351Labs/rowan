import { expect } from "@esm-bundle/chai";
import "./donut-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-donut-chart");
  chart.label = options.label !== undefined ? options.label : "Incident sources";
  chart.labels = options.labels ?? ["App", "Email", "Phone"];
  chart.series = options.series ?? [{ id: "sources", label: "Sources", values: [12, -3, 8] }];
  if (options.interactive) chart.interactive = true;
  if (options.variant) chart.variant = options.variant;
  if (options.locale !== undefined) chart.locale = options.locale;
  if (options.messages !== undefined) chart.messages = options.messages;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-donut-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("treats negative values as no-data and totals only positive slices", async () => {
    const chart = await renderChart();

    expect(chart.variant).to.equal("donut");
    expect(chart.hasAttribute("variant")).to.equal(false);
    expect(chart.shadowRoot.querySelectorAll("path.slice")).to.have.length(2);
    expect(chart.shadowRoot.querySelector("[part='total']").textContent).to.equal("20");
    expect(chart.shadowRoot.querySelector("[part='total']").hidden).to.equal(false);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Sources12No data8");
  });

  it("fills the hole for pie and keeps the total only in the table", async () => {
    const chart = await renderChart({ variant: "pie" });
    const slice = chart.shadowRoot.querySelector("path.slice");
    expect(chart.getAttribute("variant")).to.equal("pie");
    expect(chart.shadowRoot.querySelector("[part='total']").hidden).to.equal(true);
    expect(chart.shadowRoot.querySelector("[part='total']").textContent).to.equal("");
    expect(chart.shadowRoot.querySelectorAll("path.slice")).to.have.length(2);
    expect(slice.getAttribute("d")).to.match(/L100,100/);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Sources12No data8");
  });

  it("does not emit when variant is set, and omitted config variant resets to donut", async () => {
    const chart = await renderChart({ variant: "pie" });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.variant = "ring";
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.variant).to.equal("donut");
    expect(chart.hasAttribute("variant")).to.equal(false);
    expect(activations).to.have.length(0);

    chart.variant = "pie";
    chart.config = { labels: chart.labels, series: chart.series };
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.variant).to.equal("donut");
    expect(chart.shadowRoot.querySelector("[part='total']").hidden).to.equal(false);
    expect(activations).to.have.length(0);
  });

  it("emits rowan-point-activate from an interactive slice control", async () => {
    const chart = await renderChart({
      interactive: true,
      series: [{ id: "sources", label: "Sources", values: [12, 8] }],
      labels: ["App", "Phone"],
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.shadowRoot.querySelector('button[data-point-key="sources::0"]').click();
    await nextMicrotask();

    expect(activations[0].seriesId).to.equal("sources");
    expect(activations[0].label).to.equal("App");
    expect(activations[0].value).to.equal(12);
  });

  it("moves keyboard focus when a series id would break a CSS selector", async () => {
    const chart = await renderChart({
      interactive: true,
      labels: ["App", "Phone"],
      series: [{ id: 'sales"q', label: "Sales", values: [12, 8] }],
    });
    const buttons = [...chart.shadowRoot.querySelectorAll("button[data-point-key]")];
    buttons[0].focus();
    buttons[0].dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "ArrowRight" }),
    );
    await nextMicrotask();

    expect(chart.shadowRoot.activeElement).to.equal(buttons[1]);
  });

  it("uses locale and property-only messages for generated chart copy", async () => {
    const chart = await renderChart({
      label: "",
      locale: "de-DE",
      labels: ["App", "E-Mail"],
      series: [{ id: "sources", label: "Quellen", values: [1234.5, null] }],
      messages: {
        chart: ({ variant }) => (variant === "pie" ? "Kreisdiagramm" : "Ringdiagramm"),
        dataTable: "Datentabelle",
        dataTableCaption: "Tabelle: {chart}",
        metric: "Kennzahl",
        noData: "Keine Daten",
        slices: "Segmente",
        total: "Gesamt",
      },
    });
    const formatted = new Intl.NumberFormat("de-DE").format(1234.5);
    const table = chart.shadowRoot.querySelector("table");

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.locale).to.equal("de-DE");
    expect(chart.internals.ariaLabel).to.equal("Ringdiagramm");
    expect(chart.shadowRoot.querySelector(".plot").getAttribute("aria-label")).to.equal(
      "Ringdiagramm",
    );
    expect(chart.shadowRoot.querySelector(".legend").getAttribute("aria-label")).to.equal(
      "Segmente",
    );
    expect(chart.shadowRoot.querySelector("summary").textContent).to.equal("Datentabelle");
    expect(chart.shadowRoot.querySelector("[part='total']").textContent).to.equal(formatted);
    expect(table.querySelector("caption").textContent).to.equal("Tabelle: Ringdiagramm");
    expect(table.textContent).to.include(`KennzahlAppE-MailQuellen${formatted}Keine Daten`);
  });

  it("localizes generated slice labels without replacing authored labels", async () => {
    const chart = await renderChart({
      label: "",
      interactive: true,
      labels: [],
      series: [
        {
          id: "sources",
          label: "Quellen",
          values: [12, { label: "Autorisiert", value: 8 }],
        },
      ],
      messages: { point: "Punkt {index}" },
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.shadowRoot.querySelector(".legend").textContent).to.include("Punkt 1 12");
    expect(chart.shadowRoot.querySelector(".legend").textContent).to.include("Autorisiert 8");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include(
      "MetricPunkt 1AutorisiertQuellen128",
    );
    expect(
      chart.shadowRoot.querySelector('button[data-point-key="sources::0"]').textContent,
    ).to.equal("Punkt 1, 12");

    chart.messages = { point: "Kategorie {index}" };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector(".legend").textContent).to.include("Kategorie 1 12");
    expect(chart.shadowRoot.querySelector(".legend").textContent).to.include("Autorisiert 8");
    expect(activations).to.deep.equal([]);
  });
});
