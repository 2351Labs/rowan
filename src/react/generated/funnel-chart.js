/**
 * @generated from custom-elements.json
 */
import "../../funnel-chart/funnel-chart.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanFunnelChart = createRowanComponent({
  tagName: "rowan-funnel-chart",
  displayName: "RowanFunnelChart",
  events: {
    onRowanPointActivate: "rowan-point-activate",
    onRowanPointClick: "rowan-point-click",
    onRowanSelectionChange: "rowan-selection-change",
    onRowanSeriesToggle: "rowan-series-toggle",
  },
});
