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
      "Incoming bars are solid gray-green. Resolved bars are mint with a dashed edge. Legend swatches and text name both series. The open data table shows Incoming 4, 8, 6 and Resolved 2, 6, 5.",
  },
  {
    id: "bar-dark-screenshot",
    checked: "Looked at the same bar fixture with data-theme=dark.",
    result:
      "Incoming is blue and Resolved is gold with a dashed edge. The two series no longer read as the same dark green. Legend swatches match those fills. The data table still shows the fixture numbers.",
  },
  {
    id: "bar-forced-colors-screenshot",
    checked: "Looked at the bar fixture under Playwright forced-colors plus prefers-contrast: more.",
    result:
      "Legend swatches stayed visible. Resolved bars use a dashed edge and a different fill from Incoming. The disclosure marker is blue. The data table remained readable.",
  },
  {
    id: "trend-forced-colors-screenshot",
    checked: "Looked at the rowan-trend-chart fixture under the same forced-colors emulation.",
    result:
      "Legend swatches stayed visible. One line is dashed and the two fills differ (gray and purple). Axis numbers and the data table remained readable.",
  },
  {
    id: "donut-default-screenshot",
    checked: "Looked at the rowan-donut-chart fixture (App 12, Email 5, Phone 8).",
    result:
      "App is a solid slice. Email and Phone use dashed edges and different fills. The legend prints each name with its value. The center shows 25. The data table lists 12, 5, and 8.",
  },
  {
    id: "heatmap-default-screenshot",
    checked: "Looked at the rowan-heatmap-chart fixture (North/South by Mon/Tue).",
    result:
      "Mon and Tue sit under their columns. Each cell prints its value (4, 8, 1, 9). The light South/Mon cell still has a dotted border and the number 1. The data table lists the same numbers.",
  },
  {
    id: "heatmap-forced-colors-screenshot",
    checked: "Looked at the heatmap fixture under forced-colors emulation.",
    result:
      "Column labels stay under the matrix. Cell values remain visible. Cells use different system colors, and the light cell keeps a dotted border. The data table remained visible.",
  },
  {
    id: "gauge-default-screenshot",
    checked: "Looked at the rowan-gauge-chart fixture (value 72, scale 0–100, three bands).",
    result:
      "The arc prints Low, Fair, and Good. Fair and Good use a dashed stroke. The value 72 and ticks 0 and 100 are visible. A table under the gauge lists minimum, maximum, each band, actual 72, and target 80.",
  },
  {
    id: "gauge-forced-colors-screenshot",
    checked: "Looked at the gauge fixture under forced-colors emulation.",
    result:
      "Band names Low, Fair, and Good stayed on the arc. Bands use different system colors and dash patterns. The table under the gauge stayed visible, including actual 72 and target 80.",
  },
];
