import { createIcon } from "../icon.js";

const definition = {
  name: "x-line-top",
  nodes: [
    [
      "path",
      {
        d: "M18 4H6",
      },
    ],
    [
      "path",
      {
        d: "M18 8 6 20",
      },
    ],
    [
      "path",
      {
        d: "m6 8 12 12",
      },
    ],
  ],
};

/**
 * Creates the x-line-top icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function XLineTop(options) {
  return createIcon(definition, options);
}

export default XLineTop;
