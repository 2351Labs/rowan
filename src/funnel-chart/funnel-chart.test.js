import { expect } from "@esm-bundle/chai";
import "./funnel-chart.js";

const nextMicrotask = () => Promise.resolve();

function pathY(path) {
  return Number(path.getAttribute("d").match(/M[\d.-]+,([\d.-]+)/)?.[1] ?? 0);
}

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-funnel-chart");
  chart.label = options.label ?? "Conversion";
  chart.labels = options.labels ?? ["Leads", "Qualified", "Won"];
  chart.series = options.series ?? [{ id: "flow", label: "Flow", values: [10, 40, null, 20] }];
  if (options.interactive) chart.interactive = true;
  if (options.variant) chart.variant = options.variant;
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
});
