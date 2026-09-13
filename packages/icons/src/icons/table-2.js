import { createIcon } from "../icon.js";

const definition = {
  name: "table-2",
  nodes: [
    [
      "path",
      {
        d: "M3 9h18",
      },
    ],
    [
      "path",
      {
        d: "M9 3v18",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the table-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Table2(options) {
  return createIcon(definition, options);
}

export default Table2;
