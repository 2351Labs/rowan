import { createIcon } from "../icon.js";

const definition = {
  name: "x-circle",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "m15 9-6 6",
      },
    ],
    [
      "path",
      {
        d: "m9 9 6 6",
      },
    ],
  ],
};

/**
 * Creates the x-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function XCircle(options) {
  return createIcon(definition, options);
}

export default XCircle;
