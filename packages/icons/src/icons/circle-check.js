import { createIcon } from "../icon.js";

const definition = {
  name: "circle-check",
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
        d: "m16 9-5.5 5.5L8 12",
      },
    ],
  ],
};

/**
 * Creates the circle-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleCheck(options) {
  return createIcon(definition, options);
}

export default CircleCheck;
