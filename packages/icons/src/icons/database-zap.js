import { createIcon } from "../icon.js";

const definition = {
  name: "database-zap",
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
        d: "M3 5V19A9 3 0 0 0 15 21.84",
      },
    ],
    [
      "path",
      {
        d: "M21 5V8",
      },
    ],
    [
      "path",
      {
        d: "M21 12L18 17H22L19 22",
      },
    ],
    [
      "path",
      {
        d: "M3 12A9 3 0 0 0 14.59 14.87",
      },
    ],
  ],
};

/**
 * Creates the database-zap icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function DatabaseZap(options) {
  return createIcon(definition, options);
}

export default DatabaseZap;
