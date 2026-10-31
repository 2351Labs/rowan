/**
 * @generated from custom-elements.json
 */
import "../../bar-chart/bar-chart.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanBarChart = createRowanComponent({
  tagName: "rowan-bar-chart",
  displayName: "RowanBarChart",
  events: {
    onRowanPointActivate: "rowan-point-activate",
    onRowanPointClick: "rowan-point-click",
    onRowanSelectionChange: "rowan-selection-change",
    onRowanSeriesToggle: "rowan-series-toggle",
    onRowanZoom: "rowan-zoom",
  },
});
