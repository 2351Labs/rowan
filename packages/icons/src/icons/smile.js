import { createIcon } from "../icon.js";

const definition = {
  name: "smile",
  nodes: [
    [
      "path",
      {
        d: "M15 10V9",
      },
    ],
    [
      "path",
      {
        d: "M16.472 15a6 6 0 01-8.943 0",
      },
    ],
    [
      "path",
      {
        d: "M9 10V9",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
  ],
};

/**
 * Creates the smile icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Smile(options) {
  return createIcon(definition, options);
}

export default Smile;
