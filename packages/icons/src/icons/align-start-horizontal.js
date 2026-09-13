import { createIcon } from "../icon.js";

const definition = {
  name: "align-start-horizontal",
  nodes: [
    [
      "rect",
      {
        width: "6",
        height: "16",
        x: "4",
        y: "6",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "6",
        height: "9",
        x: "14",
        y: "6",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M22 2H2",
      },
    ],
  ],
};

/**
 * Creates the align-start-horizontal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignStartHorizontal(options) {
  return createIcon(definition, options);
}

export default AlignStartHorizontal;
