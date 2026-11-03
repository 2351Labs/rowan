/**
 * Pure scoring for the chart accessibility audit.
 * Status values are only Supports, Partially supports, or Does not support.
 * Remarks cite fields the audit measured. This module does not touch the DOM.
 */

export const CRITERIA = [
  { id: "1.1.1", name: "Non-text Content", level: "A" },
  { id: "1.3.1", name: "Info and Relationships", level: "A" },
  { id: "1.4.1", name: "Use of Color", level: "A" },
  { id: "1.4.3", name: "Contrast (Minimum)", level: "AA" },
  { id: "1.4.11", name: "Non-text Contrast", level: "AA" },
  { id: "2.1.1", name: "Keyboard", level: "A" },
  { id: "2.4.7", name: "Focus Visible", level: "AA" },
  { id: "2.5.8", name: "Target Size (Minimum)", level: "AA" },
  { id: "4.1.2", name: "Name, Role, Value", level: "A" },
];

export const AUDIT_STATES = ["default", "interactive", "hidden-series", "forced-colors", "dark"];

const TEXT_AXE = new Set(["color-contrast"]);
const NAME_AXE = new Set([
  "button-name",
  "aria-command-name",
  "aria-input-field-name",
  "aria-meter-name",
  "aria-progressbar-name",
  "aria-toggle-field-name",
  "aria-tooltip-name",
  "image-alt",
  "svg-img-alt",
  "label",
]);
const STRUCTURE_AXE = new Set([
  "empty-table-header",
  "th-has-data-cells",
  "scope-attr-valid",
  "td-headers-attr",
  "table-fake-caption",
  "caption",
]);
const KEYBOARD_AXE = new Set(["nested-interactive", "scrollable-region-focusable", "tabindex"]);
const TARGET_AXE = new Set(["target-size"]);

export function parseCssColor(input) {
  const value = String(input || "").trim();
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const raw = hex[1].length === 3 ? hex[1].replace(/./g, (char) => char + char) : hex[1];
    return {
      r: Number.parseInt(raw.slice(0, 2), 16),
      g: Number.parseInt(raw.slice(2, 4), 16),
      b: Number.parseInt(raw.slice(4, 6), 16),
      a: 1,
    };
  }
  const rgb = value.match(/^rgba?\(\s*([0-9.]+)[,\s]+([0-9.]+)[,\s]+([0-9.]+)(?:[,\s/]+([0-9.]+))?\s*\)$/i);
  if (!rgb) return null;
  return {
    r: Number(rgb[1]),
    g: Number(rgb[2]),
    b: Number(rgb[3]),
    a: rgb[4] === undefined ? 1 : Number(rgb[4]),
  };
}

function channel(value) {
  const scaled = value / 255;
  return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(color) {
  return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
}

export function contrastRatio(foreground, background) {
  if (!foreground || !background) return null;
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

export function roundRatio(value) {
  if (!Number.isFinite(value)) return null;
  return Math.round(value * 100) / 100;
}

export function textPasses(ratio, fontSize, fontWeight) {
  if (!Number.isFinite(ratio)) return false;
  const size = Number(fontSize) || 0;
  const weight = Number(fontWeight) || 400;
  const large = size >= 24 || (size >= 18.66 && weight >= 700);
  return ratio >= (large ? 3 : 4.5);
}

function result(id, status, remarks) {
  const criterion = CRITERIA.find((item) => item.id === id);
  return {
    id,
    name: criterion.name,
    level: criterion.level,
    status,
    remarks,
  };
}

function state(chart, name) {
  return chart.states?.[name] || null;
}

function statesOf(chart) {
  return AUDIT_STATES.map((name) => state(chart, name)).filter(Boolean);
}

function axeIds(probe) {
  return (probe?.axe?.violations || []).map((violation) => violation.id);
}

function allAxeIds(chart) {
  return [...new Set(statesOf(chart).flatMap((probe) => axeIds(probe)))];
}

function keyboardProbe(chart) {
  if (chart.keyboard === "points") return state(chart, "interactive") || state(chart, "default");
  return state(chart, "default");
}

function focusSamples(chart) {
  const names = chart.keyboard === "points" ? ["interactive", "default", "dark", "forced-colors"] : AUDIT_STATES;
  const samples = [];
  for (const name of names) {
    const foci = state(chart, name)?.keyboard?.foci || [];
    const fallback = state(chart, name)?.keyboard?.focus;
    const list = foci.length ? foci : fallback ? [fallback] : [];
    for (const focus of list) samples.push({ state: name, ...focus });
  }
  return samples;
}

function markSamples(chart) {
  return ["default", "dark", "forced-colors"].flatMap((name) => {
    const marks = state(chart, name)?.contrast?.marks || [];
    return marks.map((mark) => ({ state: name, ...mark }));
  });
}

function textSamples(chart) {
  return ["default", "dark", "forced-colors"].flatMap((name) => {
    const texts = state(chart, name)?.contrast?.texts || [];
    return texts.map((sample) => ({ state: name, ...sample }));
  });
}

function primaryText(sample) {
  return ["label", "legend", "summary", "table", "caption"].includes(sample.source);
}

function markRole(kind) {
  if (/plot-frame|grid|spoke|connector|track|\btick\b/.test(kind)) return "chrome";
  if (/series-area fill/.test(kind)) return "tint";
  return "data";
}

export function scoreChart(chart) {
  const reference = state(chart, "default");
  const hidden = state(chart, "hidden-series");
  const keys = keyboardProbe(chart);
  const axe = allAxeIds(chart);
  const missingNeedles = reference?.table?.missing || [];
  const hiddenMissing = hidden?.table?.missing || [];
  const name =
    reference?.name?.hostName ||
    reference?.name?.visibleLabel ||
    reference?.name?.plotLabel ||
    reference?.name?.svgTitle ||
    "";

  const nontext = (() => {
    if (!reference?.table?.caption || missingNeedles.length) {
      return result(
        "1.1.1",
        name ? "Partially supports" : "Does not support",
        missingNeedles.length
          ? `The default fixture table was missing: ${missingNeedles.join(", ")}.`
          : "The default fixture did not expose a data-table caption.",
      );
    }
    if (!name) {
      return result(
        "1.1.1",
        "Partially supports",
        "The data table lists the fixture values, and no accessible name was read from the host, the visible label, the plot, or the SVG title.",
      );
    }
    const hiddenNote =
      hiddenMissing.length === 0
        ? ` With hidden-series set to "${chart.hideId}", the table still included the hidden fixture text.`
        : ` With hidden-series set to "${chart.hideId}", the table was missing: ${hiddenMissing.join(", ")}.`;
    return result(
      "1.1.1",
      "Supports",
      `Accessible name "${name}" (${reference.name.hostRole || "no host role"}). Table caption "${reference.table.caption}". Every fixture needle was in the table.${hiddenNote}`,
    );
  })();

  const structure = (() => {
    const table = reference?.table;
    if (!table?.exists) {
      return result("1.3.1", "Does not support", "No data table element was found in the shadow root.");
    }
    if (!table.scopedHeaderCount) {
      return result(
        "1.3.1",
        "Partially supports",
        `The table has ${table.headerCount} header cells and none set scope.`,
      );
    }
    const axis = table.axisAriaHidden
      ? " The category or value axis is aria-hidden; the table carries those labels."
      : "";
    const hiddenClass = table.visuallyHidden
      ? " The table is clipped to a 1px visually hidden box and is not aria-hidden."
      : " The table is in a disclosure that is open in the fixture.";
    return result(
      "1.3.1",
      "Supports",
      `${table.scopedHeaderCount} header cells set scope. Caption: "${table.caption}".${axis}${hiddenClass}`,
    );
  })();

  const color = (() => {
    const info = reference?.nonColor || {};
    const channels = info.channels || [];
    if (!info.colorOnly && channels.length) {
      return result(
        "1.4.1",
        "Supports",
        `Measured non-color channel: ${channels.join(", ")}.`,
      );
    }
    if (!info.colorOnly) {
      return result(
        "1.4.1",
        "Supports",
        "The fixture marks do not use more than one color within a shape. Category names are text in the data table.",
      );
    }
    return result(
      "1.4.1",
      "Partially supports",
      "Marks that share a shape use more than one color. No dash, shape, position, or on-mark text was measured as a second channel for those marks. Legend text, when present, and the data table name each series or value.",
    );
  })();

  const text = (() => {
    const samples = textSamples(chart);
    const measured = samples.filter((sample) => Number.isFinite(sample.ratio));
    if (!measured.length) {
      return result("1.4.3", "Partially supports", "No text color sample was measured.");
    }
    const failures = measured.filter((sample) => !sample.passes);
    const axeHit = axe.includes("color-contrast");
    if (!failures.length && !axeHit) {
      const lowest = measured.reduce((best, sample) => (sample.ratio < best.ratio ? sample : best));
      return result(
        "1.4.3",
        "Supports",
        `Measured ${measured.length} text samples in default, dark, and forced-colors. Lowest ratio ${lowest.ratio}:1 on ${lowest.source} (${lowest.state}). Small text threshold is 4.5:1.`,
      );
    }
    const primary = failures.filter(primaryText);
    const listed = (primary.length ? primary : failures)
      .slice(0, 4)
      .map((sample) => `${sample.source} ${sample.ratio}:1 in ${sample.state}`)
      .join("; ");
    const axeNote = axeHit ? " Axe also reported color-contrast." : "";
    return result(
      "1.4.3",
      primary.length ? "Does not support" : "Partially supports",
      `Text below the sample threshold: ${listed}.${axeNote}`,
    );
  })();

  const graphics = (() => {
    const marks = markSamples(chart).filter((mark) => Number.isFinite(mark.ratio));
    const focus = focusSamples(chart).filter((sample) => sample.measured);
    const invisible = focus.filter((sample) => !sample.visible);
    const weakFocus = focus.filter((sample) => sample.visible && Number.isFinite(sample.ratio) && sample.ratio < 3);
    const weakMarks = marks.filter((mark) => mark.ratio < 3);
    const weakData = weakMarks.filter((mark) => markRole(mark.kind) === "data");
    const weakTint = weakMarks.filter((mark) => markRole(mark.kind) === "tint");
    const weakChrome = weakMarks.filter((mark) => markRole(mark.kind) === "chrome");
    const tintCoveredBy = (mark) =>
      marks.some(
        (other) =>
          other.state === mark.state && /series-line stroke/.test(other.kind) && other.ratio >= 3,
      );
    const uncoveredTint = weakTint.filter((mark) => !tintCoveredBy(mark));
    const coveredTint = weakTint.filter((mark) => tintCoveredBy(mark));
    if (invisible.length) {
      return result(
        "1.4.11",
        "Does not support",
        `A keyboard focus indicator was not visible in: ${invisible.map((sample) => `${sample.target} (${sample.state})`).join(", ")}.`,
      );
    }
    if (!weakData.length && !uncoveredTint.length && !weakFocus.length) {
      const dataMarks = marks.filter((mark) => markRole(mark.kind) === "data");
      const lowest = dataMarks.reduce(
        (best, mark) => (!best || mark.ratio < best.ratio ? mark : best),
        null,
      );
      const measuredFocus = focus.filter((sample) => Number.isFinite(sample.ratio));
      const focusNote = measuredFocus.length
        ? ` Lowest focus-indicator ratio ${Math.min(...measuredFocus.map((sample) => sample.ratio))}:1 across ${measuredFocus.length} samples.`
        : " Focus visibility was measured; the outline color did not resolve to an rgb ratio.";
      const chromeNote = weakChrome.length
        ? ` Axis furniture below 3:1 is not the data mark: ${weakChrome
            .slice(0, 3)
            .map((mark) => `${mark.kind} ${mark.ratio}:1 in ${mark.state}`)
            .join("; ")}.`
        : "";
      const tintNote = coveredTint.length
        ? ` Area fills are tints below 3:1 (${coveredTint
            .slice(0, 2)
            .map((mark) => `${mark.ratio}:1 in ${mark.state}`)
            .join(", ")}). The series line stroke in that state meets 3:1 and is the boundary.`
        : "";
      return result(
        "1.4.11",
        "Supports",
        `${lowest ? `Lowest data mark ${lowest.ratio}:1 (${lowest.kind}, ${lowest.state}).` : "No data-mark color was measured."}${focusNote}${chromeNote}${tintNote}`,
      );
    }
    const listed = [...weakData, ...uncoveredTint]
      .slice(0, 4)
      .map((mark) => `${mark.kind} ${mark.ratio}:1 in ${mark.state}`)
      .join("; ");
    const focusListed = weakFocus
      .map((sample) => `${sample.target} ${sample.ratio}:1 in ${sample.state}`)
      .join("; ");
    const tableMitigation =
      reference?.table?.exists && !(reference.table.missing || []).length
        ? " The data table presents the same fixture values in text."
        : "";
    return result(
      "1.4.11",
      "Partially supports",
      `${listed ? `Marks under 3:1: ${listed}. ` : ""}${focusListed ? `Focus under 3:1: ${focusListed}. ` : ""}${tableMitigation}`.trim(),
    );
  })();

  const keyboard = (() => {
    const probe = keys?.keyboard;
    if (!probe) return result("2.1.1", "Does not support", "Keyboard probe did not run.");
    if (chart.keyboard === "points") {
      if (!probe.pointButtons) {
        return result(
          "2.1.1",
          "Does not support",
          "interactive was set and no point or slice button was found.",
        );
      }
      if (probe.unnamedPoints || !probe.arrowMoves || !probe.enterActivates || !probe.spaceActivates) {
        return result(
          "2.1.1",
          "Partially supports",
          `Point buttons: ${probe.pointButtons}. Named: ${probe.pointButtons - (probe.unnamedPoints || 0)}. Arrow moved focus: ${Boolean(probe.arrowMoves)}. Enter activated: ${Boolean(probe.enterActivates)}. Space activated: ${Boolean(probe.spaceActivates)}.`,
        );
      }
      const legend = probe.legendButtons
        ? ` Legend buttons: ${probe.legendButtons}, named ${probe.legendButtons - (probe.unnamedLegends || 0)}.`
        : " No separate legend toggle was present after the lazy legend module loaded.";
      const tab = probe.tab?.inside
        ? ` Tab from the control before the chart landed on ${probe.tab.target}.`
        : probe.tab
          ? " Tab from the control before the chart did not land inside the chart."
          : "";
      return result(
        "2.1.1",
        probe.tab && !probe.tab.inside ? "Partially supports" : "Supports",
        `Arrow, Home, End, Enter, and Space were dispatched on the point buttons. Home returned to ${probe.homeKey}. End landed on ${probe.endKey}.${legend}${tab}`,
      );
    }
    const reached = probe.plotTabIndex >= 0 && probe.plotFocused;
    if (!reached || (chart.expectActivate && (!probe.enterActivates || !probe.spaceActivates))) {
      return result(
        "2.1.1",
        "Partially supports",
        `Plot tabIndex ${probe.plotTabIndex}. Focus stayed on the plot: ${Boolean(probe.plotFocused)}. Enter activated: ${Boolean(probe.enterActivates)}. Space activated: ${Boolean(probe.spaceActivates)}.`,
      );
    }
    const arrow = chart.expectArrow
      ? `Arrow changed the live region from "${probe.liveBefore}" to "${probe.liveAfter}".`
      : "The fixture has one announced value, so Arrow does not move to a second point.";
    return result(
      "2.1.1",
      chart.expectArrow && !probe.arrowAnnounces ? "Partially supports" : "Supports",
      `The plot is in tab order (tabIndex ${probe.plotTabIndex}). ${arrow} Enter fired rowan-point-activate: ${Boolean(probe.enterActivates)}.`,
    );
  })();

  const targetSize = (() => {
    const hits = [];
    for (const name of AUDIT_STATES) {
      for (const violation of state(chart, name)?.axe?.violations || []) {
        if (violation.id === "target-size") hits.push(`${name}: ${violation.nodes.join("; ")}`);
      }
    }
    if (!hits.length) {
      return result(
        "2.5.8",
        "Supports",
        "Axe target-size reported no violations. The measured controls were at least 24 CSS pixels or had 24px spacing.",
      );
    }
    return result(
      "2.5.8",
      "Does not support",
      `Axe target-size flagged undersized controls: ${hits.slice(0, 3).join(" | ")}. Point buttons are sized to the mark so the hit target stays aligned with the geometry. Growing every target to 24px would change that alignment, so it is left as a known issue. Keyboard activation and the data table still expose each value.`,
    );
  })();

  const focusVisible = (() => {
    const samples = focusSamples(chart).filter((sample) => sample.measured);
    if (!samples.length) {
      return result("2.4.7", "Partially supports", "No focusable chart control was measured.");
    }
    const hiddenFocus = samples.filter((sample) => !sample.visible);
    if (hiddenFocus.length) {
      return result(
        "2.4.7",
        "Does not support",
        `Focus indicator not visible: ${hiddenFocus.map((sample) => `${sample.target} in ${sample.state} (outline ${sample.style}, box-shadow ${sample.shadow ? "set" : "none"})`).join("; ")}.`,
      );
    }
    return result(
      "2.4.7",
      "Supports",
      `Visible focus indicator on ${samples.map((sample) => `${sample.target} (${sample.state}, ${sample.style} ${sample.width}px)`).join("; ")}.`,
    );
  })();

  const nameRole = (() => {
    const probe = reference?.name || {};
    const unnamed = (keys?.keyboard?.unnamedPoints || 0) + (keys?.keyboard?.unnamedLegends || 0);
    const nameAxe = axe.filter((id) => NAME_AXE.has(id));
    const meterOk =
      probe.hostRole !== "meter" ||
      (probe.valueNow !== null && probe.valueNow !== undefined && probe.valueMin != null && probe.valueMax != null);
    if (!probe.hostRole || !probe.hostName || unnamed || nameAxe.length || !meterOk) {
      return result(
        "4.1.2",
        probe.hostName || probe.plotLabel ? "Partially supports" : "Does not support",
        `Host role "${probe.hostRole || "none"}", host name "${probe.hostName || ""}". Unnamed controls: ${unnamed}. Meter value now/min/max: ${probe.valueNow ?? "n/a"} / ${probe.valueMin ?? "n/a"} / ${probe.valueMax ?? "n/a"}. Axe name rules: ${nameAxe.join(", ") || "none"}.`,
      );
    }
    const pressed = (keys?.keyboard?.legendPressed || []).join(", ");
    return result(
      "4.1.2",
      "Supports",
      `Host role ${probe.hostRole}, name "${probe.hostName}".${probe.hostRole === "meter" ? ` Meter value ${probe.valueNow} of ${probe.valueMin}–${probe.valueMax}.` : ""}${pressed ? ` Legend aria-pressed: ${pressed}.` : ""}`,
    );
  })();

  const criteria = [nontext, structure, color, text, graphics, keyboard, focusVisible, targetSize, nameRole];
  const mapped = new Set([
    ...TEXT_AXE,
    ...NAME_AXE,
    ...STRUCTURE_AXE,
    ...KEYBOARD_AXE,
    ...TARGET_AXE,
    "color-contrast",
  ]);
  const unmapped = axe.filter((id) => !mapped.has(id));
  if (axe.some((id) => STRUCTURE_AXE.has(id))) {
    const item = criteria.find((criterion) => criterion.id === "1.3.1");
    if (item.status === "Supports") item.status = "Partially supports";
    item.remarks += ` Axe reported ${axe.filter((id) => STRUCTURE_AXE.has(id)).join(", ")}.`;
  }
  if (axe.some((id) => KEYBOARD_AXE.has(id))) {
    const item = criteria.find((criterion) => criterion.id === "2.1.1");
    if (item.status === "Supports") item.status = "Partially supports";
    item.remarks += ` Axe reported ${axe.filter((id) => KEYBOARD_AXE.has(id)).join(", ")}.`;
  }

  return {
    id: chart.id,
    tag: chart.tag,
    title: chart.title,
    criteria,
    axe,
    unmappedAxe: unmapped,
    keyboard: keys?.keyboard || null,
    table: reference?.table || null,
    name: reference?.name || null,
    nonColor: reference?.nonColor || null,
    hidden: hidden?.hidden || null,
    screenReader: screenReaderNotes(chart, keys),
  };
}

function screenReaderNotes(chart, keys) {
  const probe = state(chart, "default");
  const name = probe?.name || {};
  const table = probe?.table || {};
  const lines = [
    "These notes are the names, roles, and live text the audit read from the DOM. They are not a NVDA, JAWS, VoiceOver, or TalkBack session.",
    `Host role: ${name.hostRole || "none"}. Host name from ElementInternals or aria-label: "${name.hostName || ""}".`,
    `Visible label text: "${name.visibleLabel || ""}". Plot aria-label: "${name.plotLabel || ""}". SVG title: "${name.svgTitle || ""}".`,
  ];
  if (name.hostRole === "meter") {
    lines.push(
      `Meter values read from ElementInternals: now ${name.valueNow}, min ${name.valueMin}, max ${name.valueMax}.`,
    );
  }
  if (table.axisAriaHidden) {
    lines.push("The painted axis is aria-hidden. The data table is the text that exposes those categories.");
  }
  lines.push(
    table.visuallyHidden
      ? `Data table caption "${table.caption}". The table is visually clipped and is not aria-hidden, so it stays in the accessibility tree. This audit did not confirm a screen reader announces it.`
      : `Data table caption "${table.caption}". The table sits in an open disclosure whose summary text is "${table.summary || ""}".`,
  );
  if (keys?.keyboard?.liveAfter) {
    lines.push(`After Arrow, the polite live region read: "${keys.keyboard.liveAfter}".`);
  } else if (keys?.keyboard?.liveBefore) {
    lines.push(`On focus, the polite live region read: "${keys.keyboard.liveBefore}".`);
  }
  const snapshot = state(chart, chart.keyboard === "points" ? "interactive" : "default")?.ariaSnapshot;
  if (snapshot) {
    lines.push(`Chromium accessibility tree excerpt for the ${chart.keyboard === "points" ? "interactive" : "default"} fixture:`);
    lines.push(snapshot);
  }
  return lines;
}

export function scoreReport(charts) {
  return charts.map((chart) => scoreChart(chart));
}
