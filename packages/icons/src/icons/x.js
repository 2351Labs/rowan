import { createIcon } from "../icon.js";

const definition = {
  name: "x",
  nodes: [
    [
      "path",
      {
        d: "M18 6 6 18",
      },
    ],
    [
      "path",
      {
        d: "m6 6 12 12",
      },
    ],
  ],
};

/**
 * Creates the x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function X(options) {
  return createIcon(definition, options);
}

export default X;
