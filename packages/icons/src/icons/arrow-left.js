import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-left",
  nodes: [
    [
      "path",
      {
        d: "m12 19-7-7 7-7",
      },
    ],
    [
      "path",
      {
        d: "M19 12H5",
      },
    ],
  ],
};

/**
 * Creates the arrow-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowLeft(options) {
  return createIcon(definition, options);
}

export default ArrowLeft;
