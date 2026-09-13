import { createIcon } from "../icon.js";

const definition = {
  name: "corner-down-right",
  nodes: [
    [
      "path",
      {
        d: "m15 10 5 5-5 5",
      },
    ],
    [
      "path",
      {
        d: "M4 4v7a4 4 0 0 0 4 4h12",
      },
    ],
  ],
};

/**
 * Creates the corner-down-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CornerDownRight(options) {
  return createIcon(definition, options);
}

export default CornerDownRight;
