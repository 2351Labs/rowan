import { createIcon } from "../icon.js";

const definition = {
  name: "maximize",
  nodes: [
    [
      "path",
      {
        d: "M8 3H5a2 2 0 0 0-2 2v3",
      },
    ],
    [
      "path",
      {
        d: "M21 8V5a2 2 0 0 0-2-2h-3",
      },
    ],
    [
      "path",
      {
        d: "M3 16v3a2 2 0 0 0 2 2h3",
      },
    ],
    [
      "path",
      {
        d: "M16 21h3a2 2 0 0 0 2-2v-3",
      },
    ],
  ],
};

/**
 * Creates the maximize icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Maximize(options) {
  return createIcon(definition, options);
}

export default Maximize;
