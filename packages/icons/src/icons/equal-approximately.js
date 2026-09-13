import { createIcon } from "../icon.js";

const definition = {
  name: "equal-approximately",
  nodes: [
    [
      "path",
      {
        d: "M5 15a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0",
      },
    ],
    [
      "path",
      {
        d: "M5 9a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0",
      },
    ],
  ],
};

/**
 * Creates the equal-approximately icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function EqualApproximately(options) {
  return createIcon(definition, options);
}

export default EqualApproximately;
