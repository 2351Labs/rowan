import { expect } from "@esm-bundle/chai";
import "./bar-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-bar-chart");
  chart.label = options.label ?? "Incidents by day";
  chart.labels = options.labels ?? ["Mon", "Tue", "Wed"];
  chart.series = options.series ?? [
    { id: "incoming", label: "Incoming", values: [4, null, 8] },
    { id: "resolved", label: "Resolved", values: [2, 7, 6] },
  ];
  if (options.interactive) chart.interactive = true;
  if (options.orientation) chart.orientation = options.orientation;
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
});
