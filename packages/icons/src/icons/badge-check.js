import { createIcon } from "../icon.js";

const definition = {
  name: "badge-check",
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
        d: "m16 9-5.5 5.5L8 12",
      },
    ],
  ],
};

/**
 * Creates the badge-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BadgeCheck(options) {
  return createIcon(definition, options);
}

export default BadgeCheck;
