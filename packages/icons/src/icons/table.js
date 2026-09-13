import { createIcon } from "../icon.js";

const definition = {
  name: "table",
  nodes: [
    [
      "path",
      {
        d: "M12 3v18",
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
        d: "M3 9h18",
      },
    ],
    [
      "path",
      {
        d: "M3 15h18",
      },
    ],
  ],
};

/**
 * Creates the table icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Table(options) {
  return createIcon(definition, options);
}

export default Table;
