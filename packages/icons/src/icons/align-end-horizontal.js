import { createIcon } from "../icon.js";

const definition = {
  name: "align-end-horizontal",
  nodes: [
    [
      "rect",
      {
        width: "6",
        height: "16",
        x: "4",
        y: "2",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "6",
        height: "9",
        x: "14",
        y: "9",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M22 22H2",
      },
    ],
  ],
};

/**
 * Creates the align-end-horizontal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignEndHorizontal(options) {
  return createIcon(definition, options);
}

export default AlignEndHorizontal;
