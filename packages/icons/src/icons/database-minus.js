import { createIcon } from "../icon.js";

const definition = {
  name: "database-minus",
  nodes: [
    [
      "path",
      {
        d: "M21 15V5",
      },
    ],
    [
      "path",
      {
        d: "M22 19h-6",
      },
    ],
    [
      "path",
      {
        d: "M3 12A9 3 0 0 0 21 12",
      },
    ],
    [
      "path",
      {
        d: "M3 5V19A9 3 0 0 0 13.318 21.968",
      },
    ],
    [
      "ellipse",
      {
        cx: "12",
        cy: "5",
        rx: "9",
        ry: "3",
      },
    ],
  ],
};

/**
 * Creates the database-minus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function DatabaseMinus(options) {
  return createIcon(definition, options);
}

export default DatabaseMinus;
