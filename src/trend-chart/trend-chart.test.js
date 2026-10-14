import { expect } from "@esm-bundle/chai";
import {
  assertPointControlAlignment,
  assertPointControlKeyboardNavigation,
  assertPointControlLifecycle,
} from "../../test/chart-interactions.js";
import "./trend-chart.js";

const nextMicrotask = () => Promise.resolve();

const INCIDENT_SERIES = [
  {
    id: "incidents",
    label: "Incidents",
    values: [4, 8, 3],
  },
  {
    id: "resolved",
    label: "Resolved",
    values: [2, 7, 6],
  },
];

async function renderChart({
  series = INCIDENT_SERIES,
  labels = ["Mon", "Tue", "Wed"],
  interactive = false,
  label = "On-call workload",
  description = "Daily incident and resolution counts.",
  locale,
  messages,
} = {}) {
  const chart = document.createElement("rowan-trend-chart");
  chart.label = label;
  chart.description = description;
  chart.series = series;
  chart.labels = labels;
  chart.interactive = interactive;
  if (locale !== undefined) chart.locale = locale;
  if (messages !== undefined) chart.messages = messages;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-trend-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("normalizes property-only series data and renders an equivalent table summary", async () => {
    const source = [
      {
        id: "incidents",
        label: "Incidents",
        values: [{ label: "Monday", value: 4 }, { value: "invalid" }],
        color: "not-a-color",
      },
    ];
    const chart = await renderChart({ series: source, labels: ["Mon", "Tue"] });
    source[0].values[0].value = 99;
    chart.labels = ["Mon", "Tue"];
    await nextMicrotask();

    expect(chart.hasAttribute("series")).to.equal(false);
    expect(chart.series).to.deep.equal([
      {
        id: "incidents",
        label: "Incidents",
        color: "",
        values: [
          { label: "Monday", value: 4 },
          { label: "Tue", value: null },
        ],
      },
    ]);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include(
      "MetricMonTueIncidents4No data",
    );
    expect(chart.shadowRoot.querySelectorAll("path.series-line")).to.have.length(1);
    expect(chart.shadowRoot.querySelector(".y-axis").textContent).to.include("4");
    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal("MonTue");
    expect(
      [...chart.shadowRoot.querySelectorAll("[part='legend-item']")].map(
        (item) => item.textContent,
      ),
    ).to.deep.equal(["Incidents"]);
  });

  it("treats config as a complete property-only replacement and formats its table values", async () => {
    const chart = await renderChart();
    chart.config = {
      labels: ["Week 1", "Week 2"],
      interactive: true,
      series: [{ id: "response", label: "Response time", values: [14, 9] }],
      valueFormatter: (value, context) => (context.tick ? String(value) : `${value} min`),
    };
    await nextMicrotask();

    expect(chart.interactive).to.equal(true);
    expect(chart.series).to.deep.equal([
      {
        id: "response",
        label: "Response time",
        color: "",
        values: [
          { label: "Week 1", value: 14 },
          { label: "Week 2", value: 9 },
        ],
      },
    ]);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include(
      "Response time14 min9 min",
    );
    expect(chart.shadowRoot.querySelector(".y-axis").textContent).to.include("14");
    expect(chart.shadowRoot.querySelector(".y-axis").textContent).to.not.include("min");
    expect(chart.shadowRoot.querySelectorAll("button[data-point-key]")).to.have.length(2);
    expect(
      [...chart.shadowRoot.querySelectorAll("[part='legend-item']")].map(
        (item) => item.textContent,
      ),
    ).to.deep.equal(["Response time"]);
  });

  it("keeps parent series and config assignment silent", async () => {
    const chart = await renderChart({ interactive: true });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event));

    chart.series = [{ id: "incidents", label: "Incidents", values: [1, 2, 3] }];
    await nextMicrotask();
    chart.config = {
      labels: ["Mon", "Tue"],
      series: [{ id: "resolved", label: "Resolved", values: [4, 5] }],
    };
    await nextMicrotask();

    expect(activations).to.have.length(0);
  });

  it("makes interactive points discoverable with Arrow keys and emits one composed activation event", async () => {
    const chart = await renderChart({ interactive: true });
    const buttons = [...chart.shadowRoot.querySelectorAll("button[data-point-key]")];
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event));

    expect(buttons).to.have.length(6);
    buttons[0].focus();
    buttons[0].dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "ArrowRight" }),
    );
    await nextMicrotask();

    expect(chart.shadowRoot.activeElement).to.equal(buttons[1]);
    expect(chart.shadowRoot.querySelector("output").textContent).to.equal("Incidents, Tue: 8");

    buttons[1].dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "Enter" }),
    );
    await nextMicrotask();

    expect(activations).to.have.length(1);
    expect(activations[0].detail).to.deep.equal({
      seriesId: "incidents",
      seriesLabel: "Incidents",
      index: 1,
      label: "Tue",
      value: 8,
      formattedValue: "8",
    });
    expect(activations[0].bubbles).to.equal(true);
    expect(activations[0].composed).to.equal(true);
  });

  it("moves keyboard focus when a series id would break a CSS selector", async () => {
    const chart = await renderChart({
      interactive: true,
      labels: ["Mon", "Tue"],
      series: [{ id: 'sales"q', label: "Sales", values: [4, 8] }],
    });
    await assertPointControlKeyboardNavigation(chart);
  });

  it("keeps an overlay hit target on its SVG point in LTR and RTL hosts", async () => {
    const chart = await renderChart({
      interactive: true,
      labels: ["Mon", "Tue"],
      series: [{ id: "incidents", label: "Incidents", values: [4, 8] }],
    });
    await assertPointControlAlignment({
      chart,
      pointSelector: "circle.point-marker",
      pointKey: "incidents::0",
      alignment: "center",
    });
  });

  it("restores point focus after rerender and hides hover after reconnects", async () => {
    const chart = await renderChart({ interactive: true });
    await assertPointControlLifecycle({
      chart,
      rerender: () => {
        chart.labels = ["Mon", "Tue", "Wed"];
      },
      markSelector: "circle.point-marker",
    });
  });

  it("keeps noninteractive visual points out of the tab order while retaining the data table", async () => {
    const chart = await renderChart();

    expect(chart.shadowRoot.querySelector(".point-controls").hidden).to.equal(true);
    expect(chart.shadowRoot.querySelectorAll("button[data-point-key]")).to.have.length(0);
    expect(chart.shadowRoot.querySelector("caption").textContent).to.equal(
      "On-call workload data table",
    );
  });

  it("renders null values as visual gaps without interactive controls", async () => {
    const chart = await renderChart({
      labels: ["Mon", "Tue", "Wed"],
      interactive: true,
      series: [
        {
          id: "incidents",
          label: "Incidents",
          values: [4, null, 8],
        },
      ],
    });

    const path = chart.shadowRoot.querySelector("path.series-line");
    const commands = path
      .getAttribute("d")
      .split(" ")
      .map((command) => command[0]);

    expect(commands).to.deep.equal(["M", "M"]);
    expect(
      [...chart.shadowRoot.querySelectorAll("button[data-point-key]")].map(
        (button) => button.dataset.pointKey,
      ),
    ).to.deep.equal(["incidents::0", "incidents::2"]);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Incidents4No data8");
  });

  it("uses default chart ARIA without replacing an author-provided label", async () => {
    const chart = document.createElement("rowan-trend-chart");
    chart.label = "Workload trend";
    chart.setAttribute("aria-label", "Custom workload chart");
    document.body.append(chart);
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.internals.role).to.equal("group");
    expect(chart.getAttribute("aria-label")).to.equal("Custom workload chart");
    expect(chart.internals.ariaLabel).to.equal("Workload trend");
  });

  it("uses locale and property-only messages for generated chart copy", async () => {
    const chart = await renderChart({
      label: "",
      description: "",
      locale: "de-DE",
      labels: ["Mo", "Di"],
      series: [{ id: "incidents", label: "Vorfälle", values: [1234.5, null] }],
      messages: {
        chart: "Liniendiagramm",
        dataTable: "Datentabelle",
        dataTableCaption: "Tabelle: {chart}",
        metric: "Kennzahl",
        noData: "Keine Daten",
        noMetricData: "Keine Messdaten",
        series: "Reihen",
      },
    });
    const formatted = new Intl.NumberFormat("de-DE").format(1234.5);
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event));
    const table = chart.shadowRoot.querySelector("table");

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.locale).to.equal("de-DE");
    expect(chart.internals.ariaLabel).to.equal("Liniendiagramm");
    expect(chart.shadowRoot.querySelector(".plot").getAttribute("aria-label")).to.equal(
      "Liniendiagramm",
    );
    expect(chart.shadowRoot.querySelector(".legend").getAttribute("aria-label")).to.equal("Reihen");
    expect(chart.shadowRoot.querySelector("summary").textContent).to.equal("Datentabelle");
    expect(table.querySelector("caption").textContent).to.equal("Tabelle: Liniendiagramm");
    expect(table.textContent).to.include(`KennzahlMoDiVorfälle${formatted}Keine Daten`);
    expect(activations).to.deep.equal([]);

    chart.series = [];
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.shadowRoot.querySelector(".empty-label").textContent).to.equal("Keine Messdaten");
  });

  it("localizes generated point labels without replacing authored labels", async () => {
    const chart = await renderChart({
      label: "",
      description: "",
      interactive: true,
      labels: [],
      series: [
        {
          id: "incidents",
          label: "Vorfälle",
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
      "MetricPunkt 1Point 1Vorfälle48",
    );
    expect(
      chart.shadowRoot
        .querySelector('button[data-point-key="incidents::0"]')
        .getAttribute("aria-label"),
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
