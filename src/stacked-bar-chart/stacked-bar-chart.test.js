import { expect } from "@esm-bundle/chai";
import "./stacked-bar-chart.js";

const nextMicrotask = () => Promise.resolve();

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-stacked-bar-chart");
  chart.label = options.label ?? "Incidents";
  if (options.description) chart.description = options.description;
  chart.labels = options.labels ?? ["Mon", "Tue"];
  chart.series = options.series ?? [
    { id: "incoming", label: "Incoming", values: [4, 2] },
    { id: "resolved", label: "Resolved", values: [1, null] },
  ];
  if (options.interactive) chart.interactive = true;
  if (options.orientation) chart.orientation = options.orientation;
  if (options.stackMode) chart.stackMode = options.stackMode;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-stacked-bar-chart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("stacks positive values and treats null as no-data", async () => {
    const chart = await renderChart();

    expect(chart.hasAttribute("series")).to.equal(false);
    expect(chart.orientation).to.equal("vertical");
    expect(chart.stackMode).to.equal("absolute");
    expect(chart.hasAttribute("orientation")).to.equal(false);
    expect(chart.hasAttribute("stack-mode")).to.equal(false);
    const bars = [...chart.shadowRoot.querySelectorAll("rect.bar")];
    expect(bars).to.have.length(3);
    const mondayIncoming = Number(bars[0].getAttribute("y"));
    const mondayResolved = Number(bars[1].getAttribute("y"));
    expect(mondayResolved).to.be.below(mondayIncoming);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Incoming42");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Resolved1No data");
    expect(chart.shadowRoot.querySelectorAll("button")).to.have.length(0);
  });

  it("keeps default stack geometry when stack-mode is omitted or invalid", async () => {
    const chart = await renderChart();
    const first = chart.shadowRoot.querySelector("rect.bar");
    const geometry = ["x", "y", "width", "height"].map((name) => first.getAttribute(name));

    chart.stackMode = "percent";
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.stackMode).to.equal("absolute");
    expect(chart.hasAttribute("stack-mode")).to.equal(false);
    expect(
      ["x", "y", "width", "height"].map((name) =>
        chart.shadowRoot.querySelector("rect.bar").getAttribute(name),
      ),
    ).to.deep.equal(geometry);
  });

  it("normalizes each category to 100 and keeps raw values in the table", async () => {
    const chart = await renderChart({
      stackMode: "normalized",
      series: [
        { id: "incoming", label: "Incoming", values: [4, 2] },
        { id: "resolved", label: "Resolved", values: [1, 2] },
      ],
    });
    const bars = [...chart.shadowRoot.querySelectorAll("rect.bar")];
    const mondayHeight =
      Number(bars[0].getAttribute("height")) + Number(bars[1].getAttribute("height"));
    const tuesdayHeight =
      Number(bars[2].getAttribute("height")) + Number(bars[3].getAttribute("height"));
    expect(chart.getAttribute("stack-mode")).to.equal("normalized");
    expect(mondayHeight).to.be.closeTo(354, 0.5);
    expect(tuesdayHeight).to.be.closeTo(354, 0.5);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Incoming42");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Resolved12");
  });

  it("draws horizontal stacks and does not emit when layout flags change", async () => {
    const chart = await renderChart({ orientation: "horizontal" });
    const activations = [];
    chart.addEventListener("rowan-point-activate", (event) => activations.push(event.detail));
    const first = chart.shadowRoot.querySelector("rect.bar");
    expect(Number(first.getAttribute("width"))).to.be.above(Number(first.getAttribute("height")));

    chart.stackMode = "normalized";
    await nextMicrotask();
    await nextMicrotask();
    expect(activations).to.have.length(0);

    chart.config = { labels: chart.labels, series: chart.series };
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.orientation).to.equal("vertical");
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

    expect(chart.shadowRoot.querySelectorAll("rect.bar")).to.have.length(3);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("P142");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("P2No data1");
  });

  it("emits rowan-point-activate from an interactive segment", async () => {
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

  it("shows the reference line on hover when interactive", async () => {
    const chart = await renderChart({ interactive: true });
    chart.referenceLines = [{ value: 5, label: "Capacity", tone: "warning" }];
    await nextMicrotask();
    await nextMicrotask();

    expect(
      getComputedStyle(chart.shadowRoot.querySelector(".point-controls")).pointerEvents,
    ).to.equal("none");
    expect(
      getComputedStyle(chart.shadowRoot.querySelector(".point-button")).pointerEvents,
    ).to.equal("auto");

    const hover = chart.shadowRoot.querySelector(".hover");
    chart.shadowRoot
      .querySelector("g.reference-line-group")
      .dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 24, clientY: 24 }));
    expect(hover.hidden).to.equal(false);
    expect(hover.textContent).to.include("Capacity");
    expect(hover.textContent).to.include("5");

    chart.shadowRoot
      .querySelector(".chart")
      .dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    expect(hover.hidden).to.equal(true);
  });

  it("expands the value domain for a reference line outside the series range", async () => {
    const chart = await renderChart();
    const barY = Number(chart.shadowRoot.querySelector("rect.bar").getAttribute("y"));
    chart.referenceLines = [{ value: 12, label: "Ceiling" }];
    await nextMicrotask();
    await nextMicrotask();

    expect(Number(chart.shadowRoot.querySelector("rect.bar").getAttribute("y"))).to.be.above(barY);
    expect(
      Number(chart.shadowRoot.querySelector("line.reference-line").getAttribute("y1")),
    ).to.be.below(Number(chart.shadowRoot.querySelector("rect.bar").getAttribute("y")));
  });
});
