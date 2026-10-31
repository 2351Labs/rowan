/**
 * @generated from custom-elements.json
 */
import "../../column-sparkline/column-sparkline.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanColumnSparkline = createRowanComponent({
  tagName: "rowan-column-sparkline",
  displayName: "RowanColumnSparkline",
  events: {
    onRowanPointClick: "rowan-point-click",
    onRowanSelectionChange: "rowan-selection-change",
    onRowanSeriesToggle: "rowan-series-toggle",
  },
});
