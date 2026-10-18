import { expect } from "@esm-bundle/chai";
import { reconnectHost } from "../../test/host-lifecycle.js";
import "./sparkline.js";

const nextMicrotask = () => Promise.resolve();

async function waitForSparklineStyles(chart) {
  const stylesheet = chart.shadowRoot.querySelector('link[rel="stylesheet"]');
  const line = chart.shadowRoot.querySelector("path.line");
  if (!stylesheet || !line) return;

  const hasLoadedRules = () => {
    try {
      return Boolean(stylesheet.sheet?.cssRules.length);
    } catch (_error) {
      return false;
    }
  };

  for (let frame = 0; frame < 60; frame += 1) {
    if (hasLoadedRules() && getComputedStyle(line).vectorEffect === "non-scaling-stroke") {
      return;
    }
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  throw new Error("Sparkline styles did not apply within 60 animation frames.");
}

async function renderSparkline(options = {}) {
  const chart = document.createElement("rowan-sparkline");
  if (options.label !== undefined) chart.label = options.label;
  if (options.tone !== undefined) chart.tone = options.tone;
  if (options.locale !== undefined) chart.locale = options.locale;
  if (options.values !== undefined) chart.values = options.values;
  if (options.labels !== undefined) chart.labels = options.labels;
  if (options.target !== undefined) chart.target = options.target;
  if (options.aboveTone !== undefined) chart.aboveTone = options.aboveTone;
  if (options.belowTone !== undefined) chart.belowTone = options.belowTone;
  if (options.variant !== undefined) chart.variant = options.variant;
  if (options.messages !== undefined) chart.messages = options.messages;
  document.body.append(chart);
  await nextMicrotask();
  await nextMicrotask();
  return chart;
}

describe("rowan-sparkline", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("exposes a name and the series values to assistive technology", async () => {
    const chart = await renderSparkline({
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

  it("breaks the line on null values and does not animate", async () => {
    const chart = await renderSparkline({
      label: "Open incidents",
      values: [4, null, 8],
    });

    const path = chart.shadowRoot.querySelector("path.line");
    const commands = path
      .getAttribute("d")
      .split(" ")
      .map((command) => command[0]);

    expect(commands).to.deep.equal(["M", "M"]);
    expect(getComputedStyle(path).animationName).to.equal("none");
  });

  it("keeps stroke width in CSS pixels when the plot scales", async () => {
    const chart = await renderSparkline({ values: [4, 8] });
    const line = chart.shadowRoot.querySelector("path.line");
    await waitForSparklineStyles(chart);

    expect(chart.shadowRoot.querySelector(".plot").getAttribute("preserveAspectRatio")).to.equal(
      "none",
    );
    expect(getComputedStyle(line).vectorEffect).to.equal("non-scaling-stroke");
    expect(getComputedStyle(line).strokeWidth).to.equal("1.75px");

    chart.style.inlineSize = "20rem";
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const plotBox = chart.shadowRoot.querySelector(".plot").getBoundingClientRect();
    const lineBox = line.getBoundingClientRect();
    expect(lineBox.width).to.be.above(plotBox.width * 0.85);

    chart.style.setProperty("--rowan-sparkline-height", "12rem");
    await nextMicrotask();
    expect(getComputedStyle(line).strokeWidth).to.equal("1.75px");

    chart.style.setProperty("--rowan-sparkline-stroke-width", "3px");
    await nextMicrotask();
    expect(getComputedStyle(line).strokeWidth).to.equal("3px");
  });

  it("keeps the hover mark in CSS pixels when the plot scales", async () => {
    const chart = await renderSparkline({
      values: [4, 8],
      labels: ["Mon", "Wed"],
    });
    chart.style.inlineSize = "20rem";
    chart.style.setProperty("--rowan-sparkline-height", "12rem");
    await waitForSparklineStyles(chart);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const plot = chart.shadowRoot.querySelector(".plot");
    const box = plot.getBoundingClientRect();
    plot.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: box.left + box.width - 2,
        clientY: box.top + 4,
      }),
    );

    const mark = chart.shadowRoot.querySelector(".hover-point");
    expect(mark).to.not.equal(null);
    expect(getComputedStyle(mark).vectorEffect).to.equal("non-scaling-stroke");
    expect(getComputedStyle(mark).strokeWidth).to.equal("4.5px");
    const markBox = mark.getBoundingClientRect();
    expect(markBox.width).to.be.below(10);
    expect(markBox.height).to.be.below(10);
  });

  it("colors rising and falling series from the data when tone is unset", async () => {
    const rising = await renderSparkline({ values: [1, 4, 9] });
    expect(rising.tone).to.equal("success");
    expect(rising.shadowRoot.querySelector(".plot").dataset.tone).to.equal("success");

    const falling = await renderSparkline({ values: [9, 4, 1] });
    expect(falling.tone).to.equal("danger");
  });

  it("shows the nearest labeled value on hover", async () => {
    const chart = await renderSparkline({
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
    expect(chart.shadowRoot.querySelector(".hover-point")).to.not.equal(null);

    plot.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    expect(hover.hidden).to.equal(true);
    expect(chart.shadowRoot.querySelector(".hover-point")).to.equal(null);
  });

  it("hides hover after reconnects", async () => {
    const chart = await renderSparkline({
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
    const chart = await renderSparkline({
      locale: "de-DE",
      values: [1234.5, null],
      messages: {
        chart: "Verlauf",
        noData: "Keine Daten",
        point: "Punkt {index}",
      },
    });
    const formatted = new Intl.NumberFormat("de-DE").format(1234.5);
    const table = chart.shadowRoot.querySelector("table");

    expect(chart.getAttribute("messages")).to.equal(null);
    expect(chart.locale).to.equal("de-DE");
    expect(chart.internals.ariaLabel).to.equal("Verlauf");
    expect(table.querySelector("caption").textContent).to.equal("Verlauf");
    expect(table.textContent).to.include(`Punkt 1${formatted}`);
    expect(table.textContent).to.include("Punkt 2Keine Daten");
  });

  it("splits the stroke above and below a property-only target", async () => {
    const chart = await renderSparkline({
      values: [0, 10],
      target: 5,
    });

    const above = chart.shadowRoot.querySelector("path.line[data-band='above']");
    const below = chart.shadowRoot.querySelector("path.line[data-band='below']");
    const mark = chart.shadowRoot.querySelector("line.target");
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
    expect(above.getAttribute("d")).to.equal(below.getAttribute("d"));
    expect(above.dataset.tone).to.equal("warning");
    expect(below.dataset.tone).to.equal("success");
    const painted = [...plot.children].map((node) => node.getAttribute("class") || node.localName);
    expect(painted.indexOf("target")).to.be.below(painted.indexOf("line"));
    expect(chart.shadowRoot.querySelectorAll("clipPath")).to.have.length(2);
    expect(above.getAttribute("clip-path")).to.match(/^url\(#.+-above\)$/);
    expect(below.getAttribute("clip-path")).to.match(/^url\(#.+-below\)$/);
    expect(mark).to.not.equal(null);
    expect(Number(mark.getAttribute("y1"))).to.be.closeTo(12, 0.01);
    expect(chart.shadowRoot.querySelector("table").textContent).to.include("Target5");

    chart.target = null;
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.shadowRoot.querySelectorAll("path.line")).to.have.length(1);
    expect(chart.shadowRoot.querySelector("line.target")).to.equal(null);
    expect(chart.shadowRoot.querySelector(".plot").dataset.split).to.equal(undefined);
  });

  it("includes the target in the y domain so a dashed line stays in plot", async () => {
    const chart = await renderSparkline({
      values: [8, 10],
      target: 0,
    });

    const mark = chart.shadowRoot.querySelector("line.target");
    const lastY = Number(
      chart.shadowRoot
        .querySelector("path.line[data-band='above']")
        .getAttribute("d")
        .match(/,([\d.]+)$/)[1],
    );
    expect(Number(mark.getAttribute("y1"))).to.be.closeTo(22.5, 0.01);
    expect(lastY).to.be.below(Number(mark.getAttribute("y1")));
  });

  it("colors the hover point from the value versus target", async () => {
    const chart = await renderSparkline({
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
    expect(chart.shadowRoot.querySelector(".hover-point").dataset.tone).to.equal("danger");

    plot.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: box.left + 2,
        clientY: box.top + 4,
      }),
    );
    expect(chart.shadowRoot.querySelector(".hover-point").dataset.tone).to.equal("info");
  });

  it("treats blank and non-finite target as no-data and rewrites invalid tones", async () => {
    const chart = await renderSparkline({
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
    expect(chart.shadowRoot.querySelectorAll("path.line")).to.have.length(1);
    expect(chart.tone).to.equal("success");
    expect(chart.shadowRoot.querySelector(".plot").dataset.tone).to.equal("success");
  });

  it("keeps a target split after reconnect", async () => {
    const chart = await renderSparkline({
      values: [2, -1, 3],
      target: 0,
    });

    expect(chart.shadowRoot.querySelector("line.target")).to.not.equal(null);
    chart.remove();
    await reconnectHost(chart);
    expect(chart.target).to.equal(0);
    expect(chart.shadowRoot.querySelector("line.target")).to.not.equal(null);
    expect(chart.shadowRoot.querySelectorAll("path.line")).to.have.length(2);
  });

  it("fills under the stroke when variant is area and omits the default", async () => {
    const chart = await renderSparkline({
      values: [4, null, 8],
      variant: "area",
    });

    const area = chart.shadowRoot.querySelector("path.area");
    expect(chart.variant).to.equal("area");
    expect(chart.getAttribute("variant")).to.equal("area");
    expect(area).to.not.equal(null);
    expect(area.getAttribute("d")).to.include("Z");
    expect(chart.shadowRoot.querySelectorAll("path.area")).to.have.length(1);

    chart.variant = "line";
    await nextMicrotask();
    await nextMicrotask();
    expect(chart.hasAttribute("variant")).to.equal(false);
    expect(chart.shadowRoot.querySelector("path.area")).to.equal(null);
  });

  it("splits the area fill at a target and rewrites an invalid variant", async () => {
    const chart = await renderSparkline({
      values: [0, 10],
      target: 5,
      variant: "blob",
    });

    expect(chart.variant).to.equal("line");
    expect(chart.hasAttribute("variant")).to.equal(false);
    expect(chart.shadowRoot.querySelector("path.area")).to.equal(null);

    chart.variant = "area";
    await nextMicrotask();
    await nextMicrotask();
    const above = chart.shadowRoot.querySelector("path.area[data-band='above']");
    const below = chart.shadowRoot.querySelector("path.area[data-band='below']");
    expect(above).to.not.equal(null);
    expect(below).to.not.equal(null);
    expect(above.getAttribute("d")).to.equal(below.getAttribute("d"));
    expect(above.getAttribute("d")).to.include("Z");
    const painted = [...chart.shadowRoot.querySelector(".plot").children].map(
      (node) => node.getAttribute("class") || node.localName,
    );
    expect(painted.indexOf("area")).to.be.below(painted.indexOf("target"));
    expect(painted.indexOf("target")).to.be.below(painted.indexOf("line"));
  });
});
