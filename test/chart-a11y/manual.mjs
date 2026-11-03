/**
 * Manual checks recorded for the chart accessibility report.
 * Each entry says what was checked. These are screenshot reviews, not
 * assistive-technology sessions.
 */
export const MANUAL_CHECKS = [
  {
    id: "bar-default-screenshot",
    checked:
      "Looked at the Chromium screenshot of rowan-bar-chart in the default fixture (Weekly throughput, Incoming and Resolved, Mon–Wed).",
    result:
      "The open data table shows Incoming 4, 8, 6 and Resolved 2, 6, 5, matching the bars. Legend text names both series. The bars themselves differ by fill color, with no pattern or dash.",
  },
  {
    id: "bar-dark-screenshot",
    checked:
      "Looked at the same bar fixture with data-theme=dark.",
    result:
      "Both series read as dark green and were hard to separate by eye. Legend text still named Incoming and Resolved, and the data table still showed the fixture numbers. This was one screenshot, not a color-vision simulation.",
  },
  {
    id: "bar-forced-colors-screenshot",
    checked:
      "Looked at the bar fixture under Playwright forced-colors plus prefers-contrast: more.",
    result:
      "The disclosure marker and summary text picked up a blue system color. Legend swatches were not visible; the words Incoming and Resolved remained. SVG bar fills stayed author gray and green rather than collapsing to a single system color.",
  },
  {
    id: "trend-forced-colors-screenshot",
    checked:
      "Looked at the rowan-trend-chart fixture under the same forced-colors emulation.",
    result:
      "Legend swatches were not visible. The two lines stayed different author colors (gray and pink). Axis numbers and the data table remained readable.",
  },
  {
    id: "donut-default-screenshot",
    checked:
      "Looked at the rowan-donut-chart fixture (App 12, Email 5, Phone 8).",
    result:
      "Three slices differ by color. The legend prints each name with its value. The center shows 25. The open data table lists Sources as 12, 5, and 8. Slice identity on the graphic is color.",
  },
  {
    id: "heatmap-default-screenshot",
    checked:
      "Looked at the rowan-heatmap-chart fixture (North/South by Mon/Tue).",
    result:
      "South/Mon is a very light cell. Column labels Mon and Tue sit close together at the right of the matrix. The data table lists 4, 8, 1, and 9.",
  },
  {
    id: "heatmap-forced-colors-screenshot",
    checked:
      "Looked at the heatmap fixture under forced-colors emulation.",
    result:
      "Cell colors stayed the author greens, including the light South/Mon cell. The disclosure marker turned blue. The data table remained visible.",
  },
  {
    id: "gauge-default-screenshot",
    checked:
      "Looked at the rowan-gauge-chart fixture (value 72, scale 0–100, three bands).",
    result:
      "The graphic shows a needle, the value 72, and ticks at 0 and 100. Band names Low, Fair, and Good are not printed on the gauge. No data table is visible, which matches the clipped table the audit found in the accessibility tree.",
  },
  {
    id: "gauge-forced-colors-screenshot",
    checked:
      "Looked at the gauge fixture under forced-colors emulation.",
    result:
      "The red, gold, and green bands stayed author colors. The value 72 and the 0 and 100 ticks stayed visible. Band names were still not printed on the graphic.",
  },
];
