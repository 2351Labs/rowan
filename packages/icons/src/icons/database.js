import { createIcon } from "../icon.js";

const definition = {
  name: "database",
  nodes: [
    [
      "ellipse",
      {
        cx: "12",
        cy: "5",
        rx: "9",
        ry: "3",
      },
    ],
    [
      "path",
      {
        d: "M3 5V19A9 3 0 0 0 21 19V5",
      },
    ],
    [
      "path",
      {
        d: "M3 12A9 3 0 0 0 21 12",
      },
    ],
  ],
};

/**
 * Creates the database icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Database(options) {
  return createIcon(definition, options);
}

export default Database;
