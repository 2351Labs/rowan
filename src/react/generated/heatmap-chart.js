/**
 * @generated from custom-elements.json
 */
import "../../heatmap-chart/heatmap-chart.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanHeatmapChart = createRowanComponent({
  tagName: "rowan-heatmap-chart",
  displayName: "RowanHeatmapChart",
  events: {
    onRowanPointActivate: "rowan-point-activate",
    onRowanPointClick: "rowan-point-click",
    onRowanSelectionChange: "rowan-selection-change",
    onRowanSeriesToggle: "rowan-series-toggle",
    onRowanSync: "rowan-sync",
    onRowanBrush: "rowan-brush",
  },
});
