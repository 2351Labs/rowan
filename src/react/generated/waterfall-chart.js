/**
 * @generated from custom-elements.json
 */
import "../../waterfall-chart/waterfall-chart.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanWaterfallChart = createRowanComponent({
  tagName: "rowan-waterfall-chart",
  displayName: "RowanWaterfallChart",
  events: {
    onRowanPointActivate: "rowan-point-activate",
    onRowanPointClick: "rowan-point-click",
    onRowanSelectionChange: "rowan-selection-change",
    onRowanSeriesToggle: "rowan-series-toggle",
  },
});
