/**
 * @generated from custom-elements.json
 */
import "../../scatter-chart/scatter-chart.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanScatterChart = createRowanComponent({
  tagName: "rowan-scatter-chart",
  displayName: "RowanScatterChart",
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
