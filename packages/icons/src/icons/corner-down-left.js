import { createIcon } from "../icon.js";

const definition = {
  name: "corner-down-left",
  nodes: [
    [
      "path",
      {
        d: "M20 4v7a4 4 0 0 1-4 4H4",
      },
    ],
    [
      "path",
      {
        d: "m9 10-5 5 5 5",
      },
    ],
  ],
};

/**
 * Creates the corner-down-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CornerDownLeft(options) {
  return createIcon(definition, options);
}

export default CornerDownLeft;
