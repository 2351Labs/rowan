/**
 * @generated from custom-elements.json
 */
import "../../sparkline/sparkline.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanSparkline = createRowanComponent({
  tagName: "rowan-sparkline",
  displayName: "RowanSparkline",
  events: {
    onRowanPointClick: "rowan-point-click",
    onRowanSelectionChange: "rowan-selection-change",
    onRowanSeriesToggle: "rowan-series-toggle",
    onRowanPointActivate: "rowan-point-activate",
  },
});
