import { createIcon } from "../icon.js";

const definition = {
  name: "rows",
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
 * Creates the rows icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Rows(options) {
  return createIcon(definition, options);
}

export default Rows;
