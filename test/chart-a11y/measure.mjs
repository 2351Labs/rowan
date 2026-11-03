import "axe-core";
import { contrastRatio, parseCssColor, roundRatio, textPasses } from "./score.mjs";

const axe = globalThis.axe;
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

export async function settle(chart) {
  await Promise.resolve();
  await Promise.resolve();
  if (chart.__z) await chart.__z;
  if (chart.__k) await chart.__k;
  if (chart.__cuesReady) await chart.__cuesReady;
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await Promise.resolve();
}

function composite(foreground, background) {
  const alpha = foreground.a === undefined ? 1 : foreground.a;
  return {
    r: foreground.r * alpha + background.r * (1 - alpha),
    g: foreground.g * alpha + background.g * (1 - alpha),
    b: foreground.b * alpha + background.b * (1 - alpha),
    a: 1,
  };
}

function opaqueBackground(element) {
  let node = element;
  while (node) {
    const parsed = parseCssColor(getComputedStyle(node).backgroundColor);
    if (parsed && parsed.a > 0.05) return parsed.a > 0.99 ? parsed : null;
    node = node.parentElement || node.getRootNode?.()?.host || null;
  }
  return parseCssColor("rgb(255, 255, 255)");
}

function paintOf(element) {
  const style = getComputedStyle(element);
  const fill = parseCssColor(style.fill);
  const stroke = parseCssColor(style.stroke);
  const fillOpacity = Number(style.fillOpacity);
  const strokeOpacity = Number(style.strokeOpacity);
  const opacity = Number(style.opacity);
  const className = element.getAttribute("class") || "";
  const strokeFirst =
    element.localName === "line" ||
    element.localName === "polyline" ||
    /needle|target|tick|whisker|median|connector|series-line|\bline\b/.test(className);
  const useStroke = strokeFirst ? style.stroke !== "none" && stroke : !fill || style.fill === "none";
  const color = useStroke ? stroke : fill;
  if (!color || (useStroke && style.stroke === "none")) return null;
  const painted = {
    ...color,
    a: (color.a ?? 1) * (useStroke ? strokeOpacity || 1 : fillOpacity || 1) * (opacity || 1),
  };
  return { color: painted, kind: useStroke ? "stroke" : "fill", width: style.strokeWidth };
}

function dispatchKey(target, key) {
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, composed: true, cancelable: true }),
  );
}

function focusCue(element) {
  if (!element || typeof element.focus !== "function") {
    return { measured: false, visible: false, target: "none", style: "none", width: 0, ratio: null, shadow: false };
  }
  try {
    element.focus({ focusVisible: true });
  } catch (_error) {
    element.focus();
  }
  const style = getComputedStyle(element);
  const width = Number.parseFloat(style.outlineWidth) || 0;
  const outlineStyle = style.outlineStyle;
  const shadow = Boolean(style.boxShadow && style.boxShadow !== "none");
  const visible = (outlineStyle !== "none" && width >= 1) || shadow;
  const outline = parseCssColor(style.outlineColor);
  const background = opaqueBackground(element);
  const ratio =
    outline && background ? roundRatio(contrastRatio(composite(outline, background), background)) : null;
  const target = element.dataset?.pointKey
    ? "point"
    : element.classList?.contains("legend-button")
      ? "legend"
      : element.localName === "summary"
        ? "summary"
        : element.localName === "svg"
          ? "plot"
          : element.localName;
  return { measured: true, visible, target, style: outlineStyle, width: roundRatio(width) || width, ratio, shadow };
}

function seriesGroup(element, multiTone) {
  const tone = element.dataset.tone || "";
  const key = element.dataset.pointKey || element.dataset.seriesId || "";
  const series = key.includes("::") ? key.slice(0, key.lastIndexOf("::")) : key;
  if (multiTone && tone) return `${series || "mark"}:${tone}`;
  return series || tone || element.localName;
}

function shapeSignature(element) {
  const style = getComputedStyle(element);
  const dash = (element.getAttribute("stroke-dasharray") || style.strokeDasharray || "none")
    .replace(/\s+/g, " ")
    .trim();
  const kind = element.getAttribute("class")?.split(/\s+/)[0] || element.localName;
  return `${element.localName}:${kind}:${dash && dash !== "none" && dash !== "0px" ? dash : "solid"}`;
}

function nonColorOf(root) {
  const svg = root.querySelector("svg.plot");
  const marks = svg
    ? [...svg.querySelectorAll("[data-point-key], [data-tone], rect, path, circle, line, polyline")].filter(
        (element) => !element.classList.contains("zero-line") && !element.classList.contains("axis-pointer"),
      )
    : [];
  const labeled = new Set(
    [...(svg?.querySelectorAll("text[data-point-key]") || [])].map((node) => node.dataset.pointKey),
  );
  const cueMarks = marks.filter((element) => !element.dataset.pointKey || !labeled.has(element.dataset.pointKey));
  const toneSource = cueMarks;
  const tones = new Set(toneSource.map((element) => element.dataset.tone).filter(Boolean));
  const multiTone = tones.size > 1;
  const groups = new Map();
  for (const element of toneSource) {
    const key = seriesGroup(element, multiTone);
    if (!groups.has(key)) groups.set(key, new Set());
    groups.get(key).add(shapeSignature(element));
  }
  const colorsByShape = new Map();
  for (const element of toneSource) {
    const signature = shapeSignature(element);
    const style = getComputedStyle(element);
    const paint =
      style.fill && style.fill !== "none"
        ? `fill:${style.fill}/${style.fillOpacity}`
        : `stroke:${style.stroke}/${style.strokeOpacity}`;
    if (!colorsByShape.has(signature)) colorsByShape.set(signature, new Set());
    if (!paint.endsWith("none/1") && !paint.includes(":none/")) colorsByShape.get(signature).add(paint);
  }
  const colorOnly = [...colorsByShape.values()].some((colors) => [...colors].filter((color) => color && color !== "none").length > 1);
  const channels = [];
  if (colorsByShape.size > 1 && !colorOnly) channels.push("shape-or-dash");
  if (labeled.size && cueMarks.length < marks.length) channels.push("on-mark text");
  if (multiTone) {
    const centers = new Map();
    for (const element of marks) {
      if (element.localName !== "rect" || !element.dataset.tone) continue;
      const y = Number(element.getAttribute("y")) + Number(element.getAttribute("height") || 0) / 2;
      if (!Number.isFinite(y)) continue;
      if (!centers.has(element.dataset.tone)) centers.set(element.dataset.tone, []);
      centers.get(element.dataset.tone).push(y);
    }
    const means = [...centers.values()]
      .filter((list) => list.length)
      .map((list) => list.reduce((sum, value) => sum + value, 0) / list.length);
    if (means.length > 1 && Math.max(...means) - Math.min(...means) > 8) channels.push("position");
  }
  const markText = svg
    ? [...svg.querySelectorAll("text")]
        .map((node) => node.textContent.trim())
        .filter(Boolean)
    : [];
  if (markText.length >= 2) channels.push("on-mark text");
  return {
    groupCount: groups.size,
    multiTone,
    colorOnly: colorOnly && !channels.includes("position"),
    channels,
    markText: markText.slice(0, 6),
  };
}

function contrastOf(root) {
  const marks = [];
  const seen = new Set();
  for (const element of root.querySelectorAll("svg [data-point-key], svg [data-tone], svg rect, svg path, svg circle, svg line")) {
    if (element.closest("defs, clipPath, mask")) continue;
    if (element.classList.contains("zero-line") || element.classList.contains("axis-pointer")) continue;
    const paint = paintOf(element);
    if (!paint) continue;
    const background = opaqueBackground(element);
    if (!background) continue;
    const style = getComputedStyle(element);
    const fillPaint = parseCssColor(style.fill);
    const strokePaint = parseCssColor(style.stroke);
    const fillRatio =
      fillPaint && style.fill !== "none"
        ? roundRatio(
            contrastRatio(
              composite(
                {
                  ...fillPaint,
                  a: (fillPaint.a ?? 1) * (Number(style.fillOpacity) || 1) * (Number(style.opacity) || 1),
                },
                background,
              ),
              background,
            ),
          )
        : null;
    const strokeWidth = Number.parseFloat(style.strokeWidth) || 0;
    const strokeRatio =
      strokePaint && style.stroke !== "none" && strokeWidth >= 1
        ? roundRatio(
            contrastRatio(
              composite(
                {
                  ...strokePaint,
                  a: (strokePaint.a ?? 1) * (Number(style.strokeOpacity) || 1) * (Number(style.opacity) || 1),
                },
                background,
              ),
              background,
            ),
          )
        : null;
    const useEdge = Number.isFinite(strokeRatio) && strokeRatio >= 3 && (!Number.isFinite(fillRatio) || fillRatio < 3);
    const ratio = useEdge ? strokeRatio : Number.isFinite(fillRatio) ? fillRatio : paint ? roundRatio(contrastRatio(composite(paint.color, background), background)) : strokeRatio;
    const own = element.getAttribute("class")?.split(/\s+/).find(Boolean);
    const parent = element.parentElement?.getAttribute("class")?.split(/\s+/).find(Boolean);
    const kind = `${own || parent || element.localName} ${useEdge ? "stroke" : paint.kind}`;
    const signature = `${kind}:${ratio}`;
    if (seen.has(signature)) continue;
    seen.add(signature);
    marks.push({ kind, ratio, passes: Number.isFinite(ratio) && ratio >= 3 });
    if (marks.length >= 8) break;
  }

  const texts = [];
  const textNodes = [
    [".label-fallback, .chart-label", "label"],
    [".legend", "legend"],
    ["summary", "summary"],
    ["table", "table"],
    ["caption", "caption"],
    [".x-axis, .y-axis", "axis"],
  ];
  for (const [selector, source] of textNodes) {
    const element = root.querySelector(selector);
    if (!element || !element.textContent.trim()) continue;
    const style = getComputedStyle(element);
    const foreground = parseCssColor(style.color);
    const background = opaqueBackground(element);
    if (!foreground || !background) continue;
    const fontSize = Number.parseFloat(style.fontSize) || 0;
    const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
    const ratio = roundRatio(contrastRatio(composite(foreground, background), background));
    texts.push({
      source,
      ratio,
      fontSize: Math.round(fontSize * 10) / 10,
      passes: textPasses(ratio, fontSize, fontWeight),
    });
  }
  return { marks, texts };
}

async function axeOf(chart) {
  if (!axe?.run) return { violations: [{ id: "axe-missing", impact: "serious", help: "axe-core did not load", nodes: [] }] };
  const results = await axe.run(chart, { runOnly: { type: "tag", values: AXE_TAGS } });
  return {
    violations: results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.slice(0, 3).map((node) =>
        node.target.join(" ").replace(/#rowan-[a-z0-9-]+-\d+/g, "#chart"),
      ),
    })),
  };
}

function tableOf(root, needles) {
  const table = root.querySelector("table");
  if (!table) {
    return {
      exists: false,
      caption: "",
      summary: root.querySelector("summary")?.textContent?.trim() || "",
      headerCount: 0,
      scopedHeaderCount: 0,
      missing: needles,
      visuallyHidden: false,
      axisAriaHidden: false,
    };
  }
  const text = table.textContent || "";
  const style = getComputedStyle(table);
  const axes = [...root.querySelectorAll(".x-axis, .y-axis, .y-axis-secondary")];
  return {
    exists: true,
    caption: table.querySelector("caption")?.textContent?.trim() || "",
    summary: root.querySelector("summary")?.textContent?.trim() || "",
    headerCount: table.querySelectorAll("th").length,
    scopedHeaderCount: [...table.querySelectorAll("th")].filter((cell) => cell.scope).length,
    missing: needles.filter((needle) => !text.includes(needle)),
    visuallyHidden: style.position === "absolute" && (Number.parseFloat(style.width) || 0) <= 2,
    axisAriaHidden: axes.length > 0 && axes.every((element) => element.getAttribute("aria-hidden") === "true"),
  };
}

function nameOf(chart, root) {
  const internals = chart.internals;
  return {
    hostRole: internals?.role || chart.getAttribute("role") || "",
    hostName: internals?.ariaLabel || chart.getAttribute("aria-label") || "",
    visibleLabel: root.querySelector(".label-fallback")?.textContent?.trim() || chart.getAttribute("label") || "",
    plotLabel: root.querySelector("svg.plot")?.getAttribute("aria-label") || "",
    svgTitle: root.querySelector("svg title")?.textContent?.trim() || "",
    valueNow: internals?.ariaValueNow ?? null,
    valueMin: internals?.ariaValueMin ?? null,
    valueMax: internals?.ariaValueMax ?? null,
  };
}

function keyboardOf(chart, root, spec) {
  const pointButtons = [...root.querySelectorAll("button[data-point-key]")].filter(
    (button) => !button.hidden && !button.disabled,
  );
  const legendButtons = [...root.querySelectorAll("button.legend-button")].filter(
    (button) => !button.dataset.pointKey && !button.hidden && !button.disabled,
  );
  const plot = root.querySelector("svg.plot");
  const summary = root.querySelector("summary");
  const live = root.querySelector("output.detail");
  let activated = 0;
  const onActivate = () => {
    activated += 1;
  };
  chart.addEventListener("rowan-point-activate", onActivate);

  let arrowMoves = false;
  let homeKey = "";
  let endKey = "";
  let liveBefore = "";
  let liveAfter = "";
  let arrowAnnounces = false;
  let plotFocused = false;

  if (spec.keyboard === "points" && pointButtons.length) {
    const first = pointButtons[0];
    first.focus();
    dispatchKey(first, "ArrowRight");
    const moved = root.activeElement;
    arrowMoves = Boolean(moved?.dataset?.pointKey && moved.dataset.pointKey !== first.dataset.pointKey);
    dispatchKey(root.activeElement || first, "Home");
    homeKey = root.activeElement?.dataset?.pointKey || "";
    dispatchKey(root.activeElement || first, "End");
    endKey = root.activeElement?.dataset?.pointKey || "";
    liveBefore = live?.textContent?.trim() || "";
    dispatchKey(root.activeElement || first, "Enter");
    dispatchKey(root.activeElement || first, " ");
    liveAfter = live?.textContent?.trim() || liveBefore;
  } else if (plot) {
    plot.focus();
    plotFocused = root.activeElement === plot;
    liveBefore = live?.textContent?.trim() || "";
    dispatchKey(plot, "ArrowRight");
    liveAfter = live?.textContent?.trim() || "";
    arrowAnnounces = Boolean(liveAfter && liveAfter !== liveBefore);
    dispatchKey(plot, "Enter");
    dispatchKey(plot, " ");
  }

  const foci = [pointButtons[0], legendButtons[0], plot && plot.tabIndex >= 0 ? plot : null, summary]
    .filter(Boolean)
    .map((element) => focusCue(element));
  const focus = foci.find((item) => item.measured && !item.visible) || foci[0] || focusCue(null);
  chart.removeEventListener("rowan-point-activate", onActivate);

  return {
    pointButtons: pointButtons.length,
    unnamedPoints: pointButtons.filter((button) => !(button.getAttribute("aria-label") || button.textContent.trim())).length,
    legendButtons: legendButtons.length,
    unnamedLegends: legendButtons.filter((button) => !button.textContent.trim() && !button.getAttribute("aria-label")).length,
    legendPressed: legendButtons.map((button) => button.getAttribute("aria-pressed")).filter(Boolean),
    arrowMoves,
    homeKey,
    endKey,
    enterActivates: activated >= 1,
    spaceActivates: activated >= 2,
    plotTabIndex: plot ? plot.tabIndex : -1,
    plotFocused,
    liveBefore,
    liveAfter,
    arrowAnnounces,
    focus,
    foci,
  };
}

function hiddenOf(root, spec) {
  return {
    id: spec.hideId,
    attribute: root.host?.getAttribute?.("hidden-series") || "",
    hiddenMarks: root.querySelectorAll(".is-series-hidden").length,
    hiddenButtons: root.querySelectorAll("button[hidden], button[disabled]").length,
  };
}

export async function auditMounted(chart, spec) {
  const root = chart.shadowRoot;
  const probe = {
    axe: await axeOf(chart),
    name: nameOf(chart, root),
    table: tableOf(root, spec.needles),
    nonColor: nonColorOf(root),
    contrast: contrastOf(root),
    keyboard: keyboardOf(chart, root, spec),
    hidden: hiddenOf(root, spec),
  };
  return probe;
}

export function stripIds(value) {
  return JSON.parse(JSON.stringify(value).replace(/#rowan-[a-z0-9-]+-\d+/g, "#chart"));
}
