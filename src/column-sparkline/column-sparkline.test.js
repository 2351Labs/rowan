import { expect } from "@esm-bundle/chai";
import { reconnectHost } from "../../test/host-lifecycle.js";
import "./column-sparkline.js";

const nextMicrotask = () => Promise.resolve();

async function waitForColumnStyles(chart) {
  const stylesheet = chart.shadowRoot.querySelector('link[rel="stylesheet"]');
  const column = chart.shadowRoot.querySelector("rect.column");
  if (!stylesheet || !column) return;

  const hasLoadedRules = () => {
    try {
      return Boolean(stylesheet.sheet?.cssRules.length);
    } catch (_error) {
      return false;
    }
  };

  for (let frame = 0; frame < 60; frame += 1) {
    if (hasLoadedRules() && getComputedStyle(column).fillOpacity !== "") {
      return;
    }
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  throw new Error("Column sparkline styles did not apply within 60 animation frames.");
}

async function renderChart(options = {}) {
  const chart = document.createElement("rowan-column-sparkline");
  if (options.label !== undefined) chart.label = options.label;
  if (options.tone !== undefined) chart.tone = options.tone;
  if (options.locale !== undefined) chart.locale = options.locale;
  if (options.values !== undefined) chart.values = options.values;
  if (options.labels !== undefined) chart.labels = options.labels;
  if (options.target !== undefined) chart.target = options.target;
  if (options.aboveTone !== undefined) chart.aboveTone = options.aboveTone;
  if (options.belowTone !== undefined) chart.belowTone = options.belowTone;
  if (options.messages !== undefined) chart.messages = options.messages;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-column-sparkline", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("exposes a name and the series values to assistive technology", async () => {
    const chart = await renderChart({
      label: "Open incidents",
      values: [4, null, 8],
      labels: ["Mon", "Tue", "Wed"],
    });

    expect(chart.hasAttribute("values")).to.equal(false);
    expect(chart.internals.role).to.equal("group");
    expect(chart.internals.ariaLabel).to.equal("Open incidents");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Open incidents");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Mon4");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("TueNo data");
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Wed8");
    expect(chart.shadowRoot.querySelectorAll("button")).to.have.length(0);
  });

  it("leaves a gap for null values and does not animate", async () => {
    const chart = await renderChart({
      label: "Open incidents",
      values: [4, null, 8],
    });

    const columns = [...chart.shadowRoot.querySelectorAll("rect.column")];
    expect(columns).to.have.length(2);
    expect(columns[0].dataset.index).to.equal("0");
    expect(columns[1].dataset.index).to.equal("2");
    expect(Number(columns[1].getAttribute("x"))).to.be.above(Number(columns[0].getAttribute("x")));
    expect(getComputedStyle(columns[0]).animationName).to.equal("none");
  });

  it("includes zero in the domain so the shortest column still has height", async () => {
    const chart = await renderChart({ values: [8, 10] });
    const columns = [...chart.shadowRoot.querySelectorAll("rect.column")];
    expect(columns).to.have.length(2);
    const first = Number(columns[0].getAttribute("height"));
    const last = Number(columns[1].getAttribute("height"));
    expect(first).to.be.above(0);
    expect(last).to.be.above(first);
  });

  it("fills the plot box", async () => {
    const chart = await renderChart({ values: [4, 8] });
    expect(chart.shadowRoot.querySelector(".plot").getAttribute("preserveAspectRatio")).to.equal(
      "none",
    );
  });

  it("colors rising and falling series from the data when tone is unset", async () => {
    const rising = await renderChart({ values: [1, 4, 9] });
    expect(rising.tone).to.equal("success");
    expect(rising.shadowRoot.querySelector(".plot").dataset.tone).to.equal("success");

    const falling = await renderChart({ values: [9, 4, 1] });
    expect(falling.tone).to.equal("danger");
  });

  it("repaints when an explicit neutral tone replaces a derived series tone", async () => {
    const chart = await renderChart({ values: [1, 4, 9] });
    expect(chart.tone).to.equal("success");
    expect(chart.hasAttribute("tone")).to.equal(false);
    expect(chart.shadowRoot.querySelector(".plot").dataset.tone).to.equal("success");

    chart.tone = "neutral";
    await nextMicrotask();
    await nextMicrotask();

    expect(chart.tone).to.equal("neutral");
    expect(chart.hasAttribute("tone")).to.equal(false);
    expect(chart.shadowRoot.querySelector(".plot").dataset.tone).to.equal("neutral");
  });

  it("shows the nearest labeled value on hover and highlights the column", async () => {
    const chart = await renderChart({
      values: [4, 8],
      labels: ["Mon", "Wed"],
    });
    chart.style.inlineSize = "200px";

    const plot = chart.shadowRoot.querySelector(".plot");
    const hover = chart.shadowRoot.querySelector(".hover");
    const box = plot.getBoundingClientRect();
    plot.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: box.left + box.width - 2,
        clientY: box.top + 4,
      }),
    );

    expect(hover.hidden).to.equal(false);
    expect(hover.textContent).to.include("Wed");
    expect(hover.textContent).to.include("8");
    expect(chart.shadowRoot.querySelector("rect.column.is-active").dataset.index).to.equal("1");

    plot.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    expect(hover.hidden).to.equal(true);
    expect(chart.shadowRoot.querySelector("rect.column.is-active")).to.equal(null);
  });

  it("hides the hover bubble when values update", async () => {
    const chart = await renderChart({
      values: [4, 8],
      labels: ["Mon", "Wed"],
    });
    chart.style.inlineSize = "200px";

    const plot = chart.shadowRoot.querySelector(".plot");
    const hover = chart.shadowRoot.querySelector(".hover");
    const box = plot.getBoundingClientRect();
    plot.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: box.left + box.width - 2,
        clientY: box.top + 4,
      }),
    );

    expect(hover.hidden).to.equal(false);
    expect(hover.textContent).to.include("Wed");
    expect(hover.textContent).to.include("8");

    chart.values = [4, 12];
    await nextMicrotask();
    await nextMicrotask();

    expect(hover.hidden).to.equal(true);
    expect(hover.textContent).to.equal("");
    expect(chart.shadowRoot.querySelector("rect.column.is-active")).to.equal(null);
  });

  it("hides hover after reconnects", async () => {
    const chart = await renderChart({
      values: [4, 8],
      labels: ["Mon", "Wed"],
    });
    chart.style.inlineSize = "200px";
    const plot = chart.shadowRoot.querySelector(".plot");
    const hover = chart.shadowRoot.querySelector(".hover");
    const showHover = () => {
      const box = plot.getBoundingClientRect();
      plot.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          clientX: box.left + box.width - 2,
          clientY: box.top + 4,
        }),
      );
    };

    showHover();
    expect(hover.hidden).to.equal(false);

    chart.remove();
    expect(hover.hidden).to.equal(true);

    await reconnectHost(chart);
    showHover();
    expect(hover.hidden).to.equal(false);

    chart.remove();
    expect(hover.hidden).to.equal(true);
  });

  it("localizes generated chart copy and number values through properties", async () => {
    const chart = await renderChart({
      locale: "de-DE",
      values: [1234.5, null],
      messages: {
        chart: "Säulen",
        noData: "Keine Daten",
        point: "Punkt {index}",
      },
    });
    const formatted = new Intl.NumberFormat("de-DE").format(1234.5);
    const table = chart.shadowRoot.querySelector("table");

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.locale).to.equal("de-DE");
    expect(chart.internals.ariaLabel).to.equal("Säulen");
    expect(table.querySelector("caption").textContent).to.equal("Säulen");
    expect(table.textContent).to.include(`Punkt 1${formatted}`);
    expect(table.textContent).to.include("Punkt 2Keine Daten");
  });

  it("splits column fill above and below a property-only target", async () => {
    const chart = await renderChart({
      values: [2, 10],
      target: 5,
    });

    const above = chart.shadowRoot.querySelector("rect.column[data-tone='warning']");
    const below = chart.shadowRoot.querySelector("rect.column[data-tone='success']");
    const mark = chart.shadowRoot.querySelector(".target");
    const plot = chart.shadowRoot.querySelector(".plot");

    expect(chart.hasAttribute("target")).to.equal(false);
    expect(chart.hasAttribute("above-tone")).to.equal(false);
    expect(chart.hasAttribute("below-tone")).to.equal(false);
    expect(chart.target).to.equal(5);
    expect(chart.aboveTone).to.equal("warning");
    expect(chart.belowTone).to.equal("success");
    expect(plot.dataset.split).to.equal("");
    expect(plot.dataset.tone).to.equal(undefined);
    expect(above).to.not.equal(null);
    expect(below).to.not.equal(null);
    expect(above.dataset.index).to.equal("1");
    expect(below.dataset.index).to.equal("0");
    const painted = [...plot.children].map((node) => node.getAttribute("class") || node.localName);
    expect(painted.indexOf("column")).to.be.below(painted.indexOf("target"));
    expect(mark).to.not.equal(null);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Target5");

    chart.target = null;
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.shadowRoot.querySelectorAll("rect.column")).to.have.length(2);
    expect(chart.shadowRoot.querySelector(".target")).to.equal(null);
    expect(chart.shadowRoot.querySelector(".plot").dataset.split).to.equal(undefined);
  });

  it("keeps target dashes in CSS pixels when the plot scales", async () => {
    const chart = await renderChart({
      values: [0, 10],
      target: 5,
    });
    chart.style.inlineSize = "20rem";
    chart.style.setProperty("--rowan-column-sparkline-height", "12rem");
    await waitForColumnStyles(chart);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const plot = chart.shadowRoot.querySelector(".plot");
    const mark = chart.shadowRoot.querySelector(".target");
    const width = plot.getBoundingClientRect().width;
    const match = mark.getAttribute("d").match(/^M([\d.]+),[\d.]+H([\d.]+)/);
    expect(match).to.not.equal(null);
    const dashPx = ((Number(match[2]) - Number(match[1])) / 100) * width;
    expect(dashPx).to.be.closeTo(4, 0.75);
  });

  it("colors hover copy from the value versus target", async () => {
    const chart = await renderChart({
      values: [4, 8],
      labels: ["Mon", "Wed"],
      target: 5,
      aboveTone: "danger",
      belowTone: "info",
    });
    chart.style.inlineSize = "200px";

    const plot = chart.shadowRoot.querySelector(".plot");
    const hover = chart.shadowRoot.querySelector(".hover");
    const box = plot.getBoundingClientRect();
    plot.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: box.left + box.width - 2,
        clientY: box.top + 4,
      }),
    );

    expect(hover.hidden).to.equal(false);
    expect(hover.textContent).to.include("Wed");
    expect(hover.textContent).to.include("Target");
    expect(hover.textContent).to.include("5");
    expect(chart.shadowRoot.querySelector("rect.column.is-active").dataset.tone).to.equal("danger");

    plot.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: box.left + 2,
        clientY: box.top + 4,
      }),
    );
    expect(chart.shadowRoot.querySelector("rect.column.is-active").dataset.tone).to.equal("info");
  });

  it("treats blank and non-finite target as no-data and rewrites invalid tones", async () => {
    const chart = await renderChart({
      values: [1, 4, 9],
      target: "  ",
      aboveTone: "hotpink",
      belowTone: "NOPE",
    });

    expect(chart.target).to.equal(null);
    expect(chart.aboveTone).to.equal("warning");
    expect(chart.belowTone).to.equal("success");
    expect(chart.hasAttribute("above-tone")).to.equal(false);
    expect(chart.hasAttribute("below-tone")).to.equal(false);
    expect(chart.shadowRoot.querySelectorAll("rect.column")).to.have.length(3);
    expect(chart.tone).to.equal("success");
    expect(chart.shadowRoot.querySelector(".plot").dataset.tone).to.equal("success");
  });

  it("keeps a target split after reconnect", async () => {
    const chart = await renderChart({
      values: [2, -1, 3],
      target: 0,
    });

    expect(chart.shadowRoot.querySelector(".target")).to.not.equal(null);
    expect(chart.shadowRoot.querySelectorAll("rect.column[data-tone]")).to.have.length(3);
    chart.remove();
    await reconnectHost(chart);
    expect(chart.target).to.equal(0);
    expect(chart.shadowRoot.querySelector(".target")).to.not.equal(null);
    expect(chart.shadowRoot.querySelectorAll("rect.column[data-tone]")).to.have.length(3);
  });
});
