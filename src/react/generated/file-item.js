/**
 * @generated from custom-elements.json
 */
import "../../file-item/file-item.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanFileItem = createRowanComponent({
  tagName: "rowan-file-item",
  displayName: "RowanFileItem",
  events: {
    onRowanRemove: "rowan-remove",
    onRowanRetry: "rowan-retry",
    onRowanCancel: "rowan-cancel",
  },
});
