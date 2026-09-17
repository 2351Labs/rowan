/**
 * @generated from custom-elements.json
 */
import "../../confirm-dialog/confirm-dialog.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanConfirmDialog = createRowanComponent({
  tagName: "rowan-confirm-dialog",
  displayName: "RowanConfirmDialog",
  events: {
    onRowanConfirm: "rowan-confirm",
    onRowanCancel: "rowan-cancel",
    onRowanClose: "rowan-close",
  },
});
