import { createIcon } from "../icon.js";

const definition = {
  name: "tornado",
  nodes: [
    [
      "path",
      {
        d: "M21 4H3",
      },
    ],
    [
      "path",
      {
        d: "M18 8H6",
      },
    ],
    [
      "path",
      {
        d: "M19 12H9",
      },
    ],
    [
      "path",
      {
        d: "M16 16h-6",
      },
    ],
    [
      "path",
      {
        d: "M11 20H9",
      },
    ],
  ],
};

/**
 * Creates the tornado icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Tornado(options) {
  return createIcon(definition, options);
}

export default Tornado;
