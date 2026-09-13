import { createIcon } from "../icon.js";

const definition = {
  name: "layout-freeform",
  nodes: [
    [
      "rect",
      {
        width: "7",
        height: "7",
        x: "3",
        y: "3",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        width: "7",
        height: "7",
        x: "14",
        y: "4",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        width: "7",
        height: "7",
        x: "4",
        y: "14",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the layout-freeform icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LayoutFreeform(options) {
  return createIcon(definition, options);
}

export default LayoutFreeform;
