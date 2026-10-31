/**
 * @generated from custom-elements.json
 */
import "../../box-plot-chart/box-plot-chart.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanBoxPlotChart = createRowanComponent({
  tagName: "rowan-box-plot-chart",
  displayName: "RowanBoxPlotChart",
  events: {
    onRowanPointActivate: "rowan-point-activate",
    onRowanPointClick: "rowan-point-click",
    onRowanSelectionChange: "rowan-selection-change",
    onRowanSeriesToggle: "rowan-series-toggle",
    onRowanZoom: "rowan-zoom",
    onRowanSync: "rowan-sync",
    onRowanBrush: "rowan-brush",
  },
});
