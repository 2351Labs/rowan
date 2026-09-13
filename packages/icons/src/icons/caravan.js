import { createIcon } from "../icon.js";

const definition = {
  name: "caravan",
  nodes: [
    [
      "path",
      {
        d: "M18 19V9a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v8a2 2 0 0 0 2 2h2",
      },
    ],
    [
      "path",
      {
        d: "M2 9h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2",
      },
    ],
    [
      "path",
      {
        d: "M22 17v1a1 1 0 0 1-1 1H10v-9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9",
      },
    ],
    [
      "circle",
      {
        cx: "8",
        cy: "19",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the caravan icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Caravan(options) {
  return createIcon(definition, options);
}

export default Caravan;
