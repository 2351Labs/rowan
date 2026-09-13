import { createIcon } from "../icon.js";

const definition = {
  name: "badge-turkish-lira",
  nodes: [
    [
      "path",
      {
        d: "M11 7v10a5 5 0 0 0 5-5",
      },
    ],
    [
      "path",
      {
        d: "m15 8-6 3",
      },
    ],
    [
      "path",
      {
        d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76",
      },
    ],
  ],
};

/**
 * Creates the badge-turkish-lira icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BadgeTurkishLira(options) {
  return createIcon(definition, options);
}

export default BadgeTurkishLira;
