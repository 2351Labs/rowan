import { createIcon } from "../icon.js";

const definition = {
  name: "flag-triangle-left",
  nodes: [
    [
      "path",
      {
        d: "M18 22V2.8a.8.8 0 0 0-1.17-.71L5.45 7.78a.8.8 0 0 0 0 1.44L18 15.5",
      },
    ],
  ],
};

/**
 * Creates the flag-triangle-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FlagTriangleLeft(options) {
  return createIcon(definition, options);
}

export default FlagTriangleLeft;
