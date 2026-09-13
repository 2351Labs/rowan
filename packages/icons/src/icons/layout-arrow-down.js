import { createIcon } from "../icon.js";

const definition = {
  name: "layout-arrow-down",
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
        x: "3",
        y: "14",
        rx: "1",
      },
    ],
    [
      "path",
      {
        d: "M18 3v18",
      },
    ],
    [
      "path",
      {
        d: "m21 18-3 3-3-3",
      },
    ],
  ],
};

/**
 * Creates the layout-arrow-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LayoutArrowDown(options) {
  return createIcon(definition, options);
}

export default LayoutArrowDown;
