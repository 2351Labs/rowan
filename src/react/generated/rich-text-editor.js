/**
 * @generated from custom-elements.json
 */
import "../../rich-text-editor/rich-text-editor.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanRichTextEditor = createRowanComponent({
  tagName: "rowan-rich-text-editor",
  displayName: "RowanRichTextEditor",
  events: {
    onRowanChange: "rowan-change",
  },
});
