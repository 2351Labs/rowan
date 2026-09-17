/**
 * @generated from custom-elements.json
 */
import "../../tree/tree.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanTree = createRowanComponent({
  tagName: "rowan-tree",
  displayName: "RowanTree",
  events: {
    onRowanChange: "rowan-change",
    onRowanToggle: "rowan-toggle",
  },
});
