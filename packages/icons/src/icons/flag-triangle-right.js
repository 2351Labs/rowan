import { createIcon } from "../icon.js";

const definition = {
  name: "flag-triangle-right",
  nodes: [
    [
      "path",
      {
        d: "M6 22V2.8a.8.8 0 0 1 1.17-.71l11.38 5.69a.8.8 0 0 1 0 1.44L6 15.5",
      },
    ],
  ],
};

/**
 * Creates the flag-triangle-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FlagTriangleRight(options) {
  return createIcon(definition, options);
}

export default FlagTriangleRight;
