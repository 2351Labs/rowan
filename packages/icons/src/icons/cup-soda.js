import { createIcon } from "../icon.js";

const definition = {
  name: "cup-soda",
  nodes: [
    [
      "path",
      {
        d: "m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8",
      },
    ],
    [
      "path",
      {
        d: "M5 8h14",
      },
    ],
    [
      "path",
      {
        d: "M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0",
      },
    ],
    [
      "path",
      {
        d: "m12 8 1-6h2",
      },
    ],
  ],
};

/**
 * Creates the cup-soda icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CupSoda(options) {
  return createIcon(definition, options);
}

export default CupSoda;
