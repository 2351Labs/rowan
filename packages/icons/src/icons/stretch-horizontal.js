import { createIcon } from "../icon.js";

const definition = {
  name: "stretch-horizontal",
  nodes: [
    [
      "rect",
      {
        width: "20",
        height: "6",
        x: "2",
        y: "4",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "20",
        height: "6",
        x: "2",
        y: "14",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the stretch-horizontal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function StretchHorizontal(options) {
  return createIcon(definition, options);
}

export default StretchHorizontal;
