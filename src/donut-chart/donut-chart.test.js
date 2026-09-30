import { expect } from "@esm-bundle/chai";
import "./donut-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-donut-chart");
  chart.label = options.label ?? "Incident sources";
  chart.labels = options.labels ?? ["App", "Email", "Phone"];
  chart.series = options.series ?? [{ id: "sources", label: "Sources", values: [12, -3, 8] }];
  if (options.interactive) chart.interactive = true;
  if (options.variant) chart.variant = options.variant;
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
});
