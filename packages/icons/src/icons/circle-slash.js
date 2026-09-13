import { createIcon } from "../icon.js";

const definition = {
  name: "circle-slash",
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
      "line",
      {
        x1: "9",
        x2: "15",
        y1: "15",
        y2: "9",
      },
    ],
  ],
};

/**
 * Creates the circle-slash icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleSlash(options) {
  return createIcon(definition, options);
}

export default CircleSlash;
