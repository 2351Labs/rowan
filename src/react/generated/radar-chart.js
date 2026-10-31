/**
 * @generated from custom-elements.json
 */
import "../../radar-chart/radar-chart.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanRadarChart = createRowanComponent({
  tagName: "rowan-radar-chart",
  displayName: "RowanRadarChart",
  events: {
    onRowanPointActivate: "rowan-point-activate",
    onRowanPointClick: "rowan-point-click",
    onRowanSelectionChange: "rowan-selection-change",
    onRowanSeriesToggle: "rowan-series-toggle",
    onRowanSync: "rowan-sync",
    onRowanBrush: "rowan-brush",
  },
});
