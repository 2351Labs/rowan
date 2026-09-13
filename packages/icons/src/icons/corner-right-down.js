import { createIcon } from "../icon.js";

const definition = {
  name: "corner-right-down",
  nodes: [
    [
      "path",
      {
        d: "m10 15 5 5 5-5",
      },
    ],
    [
      "path",
      {
        d: "M4 4h7a4 4 0 0 1 4 4v12",
      },
    ],
  ],
};

/**
 * Creates the corner-right-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CornerRightDown(options) {
  return createIcon(definition, options);
}

export default CornerRightDown;
