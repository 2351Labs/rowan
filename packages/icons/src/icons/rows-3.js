import { createIcon } from "../icon.js";

const definition = {
  name: "rows-3",
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
        d: "M21 9H3",
      },
    ],
    [
      "path",
      {
        d: "M21 15H3",
      },
    ],
  ],
};

/**
 * Creates the rows-3 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Rows3(options) {
  return createIcon(definition, options);
}

export default Rows3;
