import { createIcon } from "../icon.js";

const definition = {
  name: "eye",
  nodes: [
    [
      "path",
      {
        d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "3",
      },
    ],
  ],
};

/**
 * Creates the eye icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Eye(options) {
  return createIcon(definition, options);
}

export default Eye;
