import { createIcon } from "../icon.js";

const definition = {
  name: "corner-left-down",
  nodes: [
    [
      "path",
      {
        d: "m14 15-5 5-5-5",
      },
    ],
    [
      "path",
      {
        d: "M20 4h-7a4 4 0 0 0-4 4v12",
      },
    ],
  ],
};

/**
 * Creates the corner-left-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CornerLeftDown(options) {
  return createIcon(definition, options);
}

export default CornerLeftDown;
