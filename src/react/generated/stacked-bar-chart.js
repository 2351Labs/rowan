/**
 * @generated from custom-elements.json
 */
import "../../stacked-bar-chart/stacked-bar-chart.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanStackedBarChart = createRowanComponent({
  tagName: "rowan-stacked-bar-chart",
  displayName: "RowanStackedBarChart",
  events: {
    onRowanPointActivate: "rowan-point-activate",
    onRowanPointClick: "rowan-point-click",
    onRowanSelectionChange: "rowan-selection-change",
    onRowanSeriesToggle: "rowan-series-toggle",
    onRowanZoom: "rowan-zoom",
  },
});
