/**
 * @generated from custom-elements.json
 */
import "../../gauge-chart/gauge-chart.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanGaugeChart = createRowanComponent({
  tagName: "rowan-gauge-chart",
  displayName: "RowanGaugeChart",
  events: {
    onRowanPointClick: "rowan-point-click",
    onRowanSelectionChange: "rowan-selection-change",
    onRowanSeriesToggle: "rowan-series-toggle",
  },
});
