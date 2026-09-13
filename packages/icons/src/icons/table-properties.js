import { createIcon } from "../icon.js";

const definition = {
  name: "table-properties",
  nodes: [
    [
      "path",
      {
        d: "M15 3v18",
      },
    ],
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
 * Creates the table-properties icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TableProperties(options) {
  return createIcon(definition, options);
}

export default TableProperties;
