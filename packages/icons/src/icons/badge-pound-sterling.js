import { createIcon } from "../icon.js";

const definition = {
  name: "badge-pound-sterling",
  nodes: [
    [
      "path",
      {
        d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
      },
    ],
    [
      "path",
      {
        d: "M8 12h4",
      },
    ],
    [
      "path",
      {
        d: "M10 16V9.5a2.5 2.5 0 0 1 5 0",
      },
    ],
    [
      "path",
      {
        d: "M8 16h7",
      },
    ],
  ],
};

/**
 * Creates the badge-pound-sterling icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BadgePoundSterling(options) {
  return createIcon(definition, options);
}

export default BadgePoundSterling;
