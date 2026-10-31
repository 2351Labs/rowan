/**
 * @generated from custom-elements.json
 */
import "../../bullet-chart/bullet-chart.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanBulletChart = createRowanComponent({
  tagName: "rowan-bullet-chart",
  displayName: "RowanBulletChart",
  events: {
    onRowanPointClick: "rowan-point-click",
    onRowanSelectionChange: "rowan-selection-change",
    onRowanSeriesToggle: "rowan-series-toggle",
    onRowanPointActivate: "rowan-point-activate",
  },
});
