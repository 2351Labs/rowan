import { createIcon } from "../icon.js";

const definition = {
  name: "handbag",
  nodes: [
    [
      "path",
      {
        d: "M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z",
      },
    ],
    [
      "path",
      {
        d: "M8 11V6a4 4 0 0 1 8 0v5",
      },
    ],
  ],
};

/**
 * Creates the handbag icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Handbag(options) {
  return createIcon(definition, options);
}

export default Handbag;
