import { createIcon } from "../icon.js";

const definition = {
  name: "circle-user-round",
  nodes: [
    [
      "path",
      {
        d: "M17.925 20.056a6 6 0 0 0-11.851.001",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "11",
        r: "4",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
  ],
};

/**
 * Creates the circle-user-round icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleUserRound(options) {
  return createIcon(definition, options);
}

export default CircleUserRound;
