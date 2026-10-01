import { expect } from "@esm-bundle/chai";
import {
  assertPointControlAlignment,
  assertPointControlKeyboardNavigation,
  assertPointControlLifecycle,
} from "../../test/chart-interactions.js";
import "./bar-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-bar-chart");
  chart.label = options.label !== undefined ? options.label : "Incidents by day";
  chart.labels = options.labels ?? ["Mon", "Tue", "Wed"];
  chart.series = options.series ?? [
    { id: "incoming", label: "Incoming", values: [4, null, 8] },
    { id: "resolved", label: "Resolved", values: [2, 7, 6] },
  ];
  if (options.interactive) chart.interactive = true;
  if (options.orientation) chart.orientation = options.orientation;
  if (options.locale !== undefined) chart.locale = options.locale;
  if (options.messages !== undefined) chart.messages = options.messages;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-bar-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders grouped bars and a matching data table, skipping nulls", async () => {
    const chart = await renderChart();

    expect(chart.hasAttribute("series")).to.equal(false);
    expect(chart.orientation).to.equal("vertical");
    expect(chart.hasAttribute("orientation")).to.equal(false);
    expect(chart.shadowRoot.querySelectorAll("rect.bar")).to.have.length(5);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Incoming4No data8");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Resolved276");
    expect(chart.shadowRoot.querySelectorAll("button")).to.have.length(0);
  });

  it("keeps default vertical geometry when orientation is omitted or invalid", async () => {
    const chart = await renderChart();
    const first = chart.shadowRoot.querySelector("rect.bar");
    const geometry = ["x", "y", "width", "height"].map((name) => first.getAttribute(name));

    chart.orientation = "vertical";
    await nextMicrotask();
    await nextMicrotask();
    expect(
      ["x", "y", "width", "height"].map((name) =>
        chart.shadowRoot.querySelector("rect.bar").getAttribute(name),
      ),
    ).to.deep.equal(geometry);

    chart.orientation = "diagonal";
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.orientation).to.equal("vertical");
    expect(chart.hasAttribute("orientation")).to.equal(false);
    expect(
      ["x", "y", "width", "height"].map((name) =>
        chart.shadowRoot.querySelector("rect.bar").getAttribute(name),
      ),
    ).to.deep.equal(geometry);
  });

  it("draws horizontal bars with truncated category labels", async () => {
    const chart = await renderChart({
      orientation: "horizontal",
      labels: ["Mon", "Tuesday overnight backlog", "Wed"],
    });
    const first = chart.shadowRoot.querySelector("rect.bar");
    expect(chart.getAttribute("orientation")).to.equal("horizontal");
    expect(Number(first.getAttribute("width"))).to.be.above(Number(first.getAttribute("height")));
    const longLabel = [...chart.shadowRoot.querySelectorAll(".x-axis span")].find(
      (item) => item.textContent === "Tuesday overnight backlog",
    );
    expect(longLabel.title).to.equal("Tuesday overnight backlog");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Incoming4No data8");
  });

  it("does not emit when orientation is set, and config without orientation resets vertical", async () => {
    const chart = await renderChart({ orientation: "horizontal" });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    chart.orientation = "vertical";
    await nextMicrotask();
    await nextMicrotask();
    expect(activations).to.have.length(0);

    chart.orientation = "horizontal";
    chart.config = { labels: chart.labels, series: chart.series };
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.orientation).to.equal("vertical");
    expect(chart.hasAttribute("orientation")).to.equal(false);
    expect(activations).to.have.length(0);
  });

  it("emits rowan-point-activate from an interactive bar", async () => {
    const chart = await renderChart({ interactive: true });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    const button = chart.shadowRoot.querySelector('button[data-point-key="incoming::0"]');
    button.click();
    await nextMicrotask();

    expect(activations).to.have.length(1);
    expect(activations[0].seriesId).to.equal("incoming");
    expect(activations[0].index).to.equal(0);
    expect(activations[0].value).to.equal(4);
    expect(activations[0]).to.not.have.property("x");
    expect(activations[0]).to.not.have.property("y");
  });

  it("shows the hovered bar value", async () => {
    const chart = await renderChart();
    const bar = chart.shadowRoot.querySelector("rect.bar");
    const hover = chart.shadowRoot.querySelector(".hover");
    bar.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 24, clientY: 24 }));
    expect(hover.hidden).to.equal(false);
    expect(hover.textContent).to.match(/Incoming, Mon: 4/);

    chart.shadowRoot
      .querySelector(".chart")
      .dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    expect(hover.hidden).to.equal(true);
  });

  it("keeps overlay hit targets on SVG bars in LTR and RTL hosts", async () => {
    const chart = await renderChart({ interactive: true });
    await assertPointControlAlignment({
      chart,
      pointSelector: "rect.bar",
      pointKey: "incoming::0",
    });
  });

  it("hides hover after a second disconnect", async () => {
    const chart = await renderChart();
    const hover = chart.shadowRoot.querySelector(".hover");
    const showHover = () => {
      chart.shadowRoot
        .querySelector("rect.bar")
        .dispatchEvent(
          new PointerEvent("pointermove", { bubbles: true, clientX: 24, clientY: 24 }),
        );
    };

    showHover();
    expect(hover.hidden).to.equal(false);

    chart.remove();
    expect(hover.hidden).to.equal(true);

    document.body.append(chart);
    await nextMicrotask();
    await nextMicrotask();
    showHover();
    expect(hover.hidden).to.equal(false);

    chart.remove();
    expect(hover.hidden).to.equal(true);
  });

  it("moves keyboard focus when a series id would break a CSS selector", async () => {
    const chart = await renderChart({
      interactive: true,
      labels: ["Mon", "Tue"],
      series: [{ id: 'sales"q', label: "Sales", values: [4, 8] }],
    });
    await assertPointControlKeyboardNavigation(chart);
  });

  it("restores point focus and cleans up interactive hover after reconnect", async () => {
    const chart = await renderChart({ interactive: true });
    await assertPointControlLifecycle({
      chart,
      rerender: () => {
        chart.labels = ["Mon", "Tue", "Wed"];
      },
      markSelector: "rect.bar",
    });
  });

  it("does not move focus onto a point control during rerender", async () => {
    const chart = await renderChart({ interactive: true });
    const outside = document.createElement("button");
    outside.textContent = "Outside";
    document.body.append(outside);
    outside.focus();

    chart.labels = ["Mon", "Tue", "Wed"];
    await nextMicrotask();
    await nextMicrotask();

    expect(document.activeElement).to.equal(outside);
  });

  it("does not force focus onto another point when the active key is gone", async () => {
    const chart = await renderChart({ interactive: true });
    const first = chart.shadowRoot.querySelector("button[data-point-key]");
    const previousKey = first.dataset.pointKey;
    first.focus();

    chart.series = [{ id: "other", label: "Other", values: [1, 2, 3] }];
    await nextMicrotask();
    await nextMicrotask();

    const buttons = [...chart.shadowRoot.querySelectorAll("button[data-point-key]")];
    expect(buttons.some((button) => button.dataset.pointKey === previousKey)).to.equal(false);
    expect(buttons.includes(chart.shadowRoot.activeElement)).to.equal(false);
  });

  it("uses locale and property-only messages for generated chart copy", async () => {
    const chart = await renderChart({
      label: "",
      locale: "de-DE",
      labels: ["Mo", "Di"],
      series: [{ id: "incoming", label: "Eingehend", values: [1234.5, null] }],
      messages: {
        chart: "Balkendiagramm",
        dataTable: "Datentabelle",
        dataTableCaption: "Tabelle: {chart}",
        metric: "Kennzahl",
        noData: "Keine Daten",
        series: "Reihen",
      },
    });
    const formatted = new Intl.NumberFormat("de-DE").format(1234.5);
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event));
    const table = chart.shadowRoot.querySelector("table");

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.locale).to.equal("de-DE");
    expect(chart.internals.ariaLabel).to.equal("Balkendiagramm");
    expect(chart.shadowRoot.querySelector(".plot").getAttribute("aria-label")).to.equal(
      "Balkendiagramm",
    );
    expect(chart.shadowRoot.querySelector(".legend").getAttribute("aria-label")).to.equal("Reihen");
    expect(chart.shadowRoot.querySelector("summary").textContent).to.equal("Datentabelle");
    expect(table.querySelector("caption").textContent).to.equal("Tabelle: Balkendiagramm");
    expect(table.textContent).to.include(`KennzahlMoDiEingehend${formatted}Keine Daten`);
    expect(activations).to.deep.equal([]);
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
          values: [4, { label: "Autorisiert", value: 8 }],
        },
      ],
      messages: {
        point: "Punkt {index}",
      },
    });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal("Punkt 1Autorisiert");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include(
      "MetricPunkt 1AutorisiertEingehend48",
    );
    expect(
      chart.shadowRoot
        .querySelector('button[data-point-key="incoming::0"]')
        .getAttribute("aria-label"),
    ).to.include("Punkt 1");

    chart.messages = { point: "Kategorie {index}" };
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.shadowRoot.querySelector(".x-axis").textContent).to.equal(
      "Kategorie 1Autorisiert",
    );
    expect(activations).to.deep.equal([]);
  });
});
