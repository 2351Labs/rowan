/**
 * Shared browser-side checks for chart stories and documentation demos.
 *
 * A populated chart must draw a data mark (bar, line, needle, slice, target, …).
 * Decorative gauge tracks, hubs, ticks, and range bands do not count: a gauge
 * with no actual and no target still paints those. A target tick counts, so a
 * bullet or gauge whose story is the missing actual still has a mark.
 * "No data" / "No metric data" outside the equivalent data table is the empty
 * state. A null cell inside that table is the documented gap label.
 */

export const CHART_TAGS = [
  "rowan-area-chart",
  "rowan-bar-chart",
  "rowan-box-plot-chart",
  "rowan-bullet-chart",
  "rowan-column-sparkline",
  "rowan-combo-chart",
  "rowan-donut-chart",
  "rowan-funnel-chart",
  "rowan-gauge-chart",
  "rowan-heatmap-chart",
  "rowan-radar-chart",
  "rowan-range-chart",
  "rowan-scatter-chart",
  "rowan-sparkline",
  "rowan-stacked-area-chart",
  "rowan-stacked-bar-chart",
  "rowan-trend-chart",
  "rowan-waterfall-chart",
];

export const KPI_TAG = "rowan-kpi-card";

export const DATA_MARK_SELECTOR = [
  '[part="actual"]',
  '[part="area"]',
  '[part="bar"]',
  '[part="box"]',
  '[part="cell"]',
  '[part="column"]',
  '[part="line"]',
  '[part="median"]',
  '[part="needle"]',
  '[part="outlier"]',
  '[part="point"]',
  '[part="point-marker"]',
  '[part="slice"]',
  '[part="stage"]',
  '[part="target"]',
  '[part="whisker"]',
].join(",");

export const EMPTY_STATE_SOURCE = "\\bNo data\\b|\\bNo metric data\\b";

export const CHART_RENDER_CONFIG = {
  chartTags: CHART_TAGS,
  kpiTag: KPI_TAG,
  dataMarkSelector: DATA_MARK_SELECTOR,
  emptyStateSource: EMPTY_STATE_SOURCE,
};

/**
 * Runs inside the page. Keep it free of closed-over bindings so Playwright
 * can serialize it.
 */
export function inspectRenderedCharts({
  chartTags,
  kpiTag,
  dataMarkSelector,
  emptyStateSource,
}) {
  const emptyState = new RegExp(emptyStateSource);
  const charts = chartTags.flatMap((tag) => [...document.querySelectorAll(tag)]);
  const kpis = [...document.querySelectorAll(kpiTag)];
  const problems = [];

  function emptyStateOutsideTable(element) {
    const root = element.shadowRoot;
    if (!root) return false;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const parent = node.parentElement;
      if (!parent?.closest("table")) {
        const text = node.textContent || "";
        if (emptyState.test(text)) return text.trim();
      }
      node = walker.nextNode();
    }
    return "";
  }

  function hasDataMark(element) {
    return Boolean(element.shadowRoot?.querySelector(dataMarkSelector));
  }

  if (charts.length === 0 && kpis.length === 0) {
    problems.push("No chart or KPI rendered");
  }

  for (const chart of charts) {
    const name = chart.localName;
    if (!chart.shadowRoot) {
      problems.push(`${name} did not upgrade`);
      continue;
    }
    if (!hasDataMark(chart)) problems.push(`${name} rendered with no data marks`);
    const emptyText = emptyStateOutsideTable(chart);
    if (emptyText) problems.push(`${name} shows empty state "${emptyText}"`);
  }

  for (const kpi of kpis) {
    if (!kpi.shadowRoot) {
      problems.push("rowan-kpi-card did not upgrade");
      continue;
    }
    const emptyText = emptyStateOutsideTable(kpi);
    if (emptyText) problems.push(`rowan-kpi-card shows empty state "${emptyText}"`);
  }

  return { problems, chartCount: charts.length, kpiCount: kpis.length };
}
