/**
 * @generated from custom-elements.json
 */
import "../../bulk-actions-bar/bulk-actions-bar.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanBulkActionsBar = createRowanComponent({
  tagName: "rowan-bulk-actions-bar",
  displayName: "RowanBulkActionsBar",
  events: {
    onRowanBulkAction: "rowan-bulk-action",
    onRowanClearSelection: "rowan-clear-selection",
  },
});
