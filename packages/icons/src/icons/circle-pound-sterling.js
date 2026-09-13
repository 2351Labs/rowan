import { createIcon } from "../icon.js";

const definition = {
  name: "circle-pound-sterling",
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
        d: "M10 16V9.5a1 1 0 0 1 5 0",
      },
    ],
    [
      "path",
      {
        d: "M8 12h4",
      },
    ],
    [
      "path",
      {
        d: "M8 16h7",
      },
    ],
  ],
};

/**
 * Creates the circle-pound-sterling icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CirclePoundSterling(options) {
  return createIcon(definition, options);
}

export default CirclePoundSterling;
