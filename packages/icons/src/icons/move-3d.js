import { createIcon } from "../icon.js";

const definition = {
  name: "move-3d",
  nodes: [
    [
      "path",
      {
        d: "M5 3v16h16",
      },
    ],
    [
      "path",
      {
        d: "m5 19 6-6",
      },
    ],
    [
      "path",
      {
        d: "m2 6 3-3 3 3",
      },
    ],
    [
      "path",
      {
        d: "m18 16 3 3-3 3",
      },
    ],
  ],
};

/**
 * Creates the move-3d icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Move3d(options) {
  return createIcon(definition, options);
}

export default Move3d;
