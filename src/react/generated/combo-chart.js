/**
 * @generated from custom-elements.json
 */
import "../../combo-chart/combo-chart.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanComboChart = createRowanComponent({
  tagName: "rowan-combo-chart",
  displayName: "RowanComboChart",
  events: {
    onRowanPointActivate: "rowan-point-activate",
    onRowanPointClick: "rowan-point-click",
    onRowanSelectionChange: "rowan-selection-change",
    onRowanSeriesToggle: "rowan-series-toggle",
    onRowanZoom: "rowan-zoom",
  },
});
