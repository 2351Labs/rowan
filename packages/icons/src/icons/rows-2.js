import { createIcon } from "../icon.js";

const definition = {
  name: "rows-2",
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
        d: "M3 12h18",
      },
    ],
  ],
};

/**
 * Creates the rows-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Rows2(options) {
  return createIcon(definition, options);
}

export default Rows2;
