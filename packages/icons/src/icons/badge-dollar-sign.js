import { createIcon } from "../icon.js";

const definition = {
  name: "badge-dollar-sign",
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
        d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",
      },
    ],
    [
      "path",
      {
        d: "M12 18V6",
      },
    ],
  ],
};

/**
 * Creates the badge-dollar-sign icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BadgeDollarSign(options) {
  return createIcon(definition, options);
}

export default BadgeDollarSign;
