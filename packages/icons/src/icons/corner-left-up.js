import { createIcon } from "../icon.js";

const definition = {
  name: "corner-left-up",
  nodes: [
    [
      "path",
      {
        d: "M14 9 9 4 4 9",
      },
    ],
    [
      "path",
      {
        d: "M20 20h-7a4 4 0 0 1-4-4V4",
      },
    ],
  ],
};

/**
 * Creates the corner-left-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CornerLeftUp(options) {
  return createIcon(definition, options);
}

export default CornerLeftUp;
