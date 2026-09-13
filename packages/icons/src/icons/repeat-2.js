import { createIcon } from "../icon.js";

const definition = {
  name: "repeat-2",
  nodes: [
    [
      "path",
      {
        d: "m2 9 3-3 3 3",
      },
    ],
    [
      "path",
      {
        d: "M13 18H7a2 2 0 0 1-2-2V6",
      },
    ],
    [
      "path",
      {
        d: "m22 15-3 3-3-3",
      },
    ],
    [
      "path",
      {
        d: "M11 6h6a2 2 0 0 1 2 2v10",
      },
    ],
  ],
};

/**
 * Creates the repeat-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Repeat2(options) {
  return createIcon(definition, options);
}

export default Repeat2;
