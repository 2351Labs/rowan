import { createIcon } from "../icon.js";

const definition = {
  name: "corner-up-left",
  nodes: [
    [
      "path",
      {
        d: "M20 20v-7a4 4 0 0 0-4-4H4",
      },
    ],
    [
      "path",
      {
        d: "M9 14 4 9l5-5",
      },
    ],
  ],
};

/**
 * Creates the corner-up-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CornerUpLeft(options) {
  return createIcon(definition, options);
}

export default CornerUpLeft;
