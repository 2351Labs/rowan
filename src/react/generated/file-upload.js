/**
 * @generated from custom-elements.json
 */
import "../../file-upload/file-upload.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanFileUpload = createRowanComponent({
  tagName: "rowan-file-upload",
  displayName: "RowanFileUpload",
  events: {
    onRowanFilesAdd: "rowan-files-add",
    onRowanFileRemove: "rowan-file-remove",
    onRowanFileRetry: "rowan-file-retry",
    onRowanFileCancel: "rowan-file-cancel",
  },
});
