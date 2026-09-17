/**
 * @generated from custom-elements.json
 */
import "../../toaster/toaster.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanToaster = createRowanComponent({
  tagName: "rowan-toaster",
  displayName: "RowanToaster",
  events: {
    onRowanToastShow: "rowan-toast-show",
    onRowanToastDismiss: "rowan-toast-dismiss",
  },
});
