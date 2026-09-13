import { createIcon } from "../icon.js";

const definition = {
  name: "corner-right-up",
  nodes: [
    [
      "path",
      {
        d: "m10 9 5-5 5 5",
      },
    ],
    [
      "path",
      {
        d: "M4 20h7a4 4 0 0 0 4-4V4",
      },
    ],
  ],
};

/**
 * Creates the corner-right-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CornerRightUp(options) {
  return createIcon(definition, options);
}

export default CornerRightUp;
