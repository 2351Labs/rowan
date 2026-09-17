/**
 * @generated from custom-elements.json
 */
import "../../command-palette/command-palette.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanCommandPalette = createRowanComponent({
  tagName: "rowan-command-palette",
  displayName: "RowanCommandPalette",
  events: {
    onRowanCommand: "rowan-command",
    onRowanClose: "rowan-close",
  },
});
