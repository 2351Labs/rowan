/**
 * @generated from custom-elements.json
 */
import "../../trend-chart/trend-chart.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanTrendChart = createRowanComponent({
  tagName: "rowan-trend-chart",
  displayName: "RowanTrendChart",
  events: {
    onRowanPointActivate: "rowan-point-activate",
    onRowanPointClick: "rowan-point-click",
    onRowanSelectionChange: "rowan-selection-change",
    onRowanSeriesToggle: "rowan-series-toggle",
    onRowanZoom: "rowan-zoom",
  },
});
