import { createIcon } from "../icon.js";

const definition = {
  name: "rows-4",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M21 7.5H3",
      },
    ],
    [
      "path",
      {
        d: "M21 12H3",
      },
    ],
    [
      "path",
      {
        d: "M21 16.5H3",
      },
    ],
  ],
};

/**
 * Creates the rows-4 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Rows4(options) {
  return createIcon(definition, options);
}

export default Rows4;
