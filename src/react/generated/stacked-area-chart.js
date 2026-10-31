/**
 * @generated from custom-elements.json
 */
import "../../stacked-area-chart/stacked-area-chart.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanStackedAreaChart = createRowanComponent({
  tagName: "rowan-stacked-area-chart",
  displayName: "RowanStackedAreaChart",
  events: {
    onRowanPointActivate: "rowan-point-activate",
    onRowanPointClick: "rowan-point-click",
    onRowanSelectionChange: "rowan-selection-change",
    onRowanSeriesToggle: "rowan-series-toggle",
    onRowanZoom: "rowan-zoom",
  },
});
