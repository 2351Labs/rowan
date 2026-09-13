import { createIcon } from "../icon.js";

const definition = {
  name: "circle-pile",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "19",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "5",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "16",
        cy: "12",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "20",
        cy: "19",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "4",
        cy: "19",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "8",
        cy: "12",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the circle-pile icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CirclePile(options) {
  return createIcon(definition, options);
}

export default CirclePile;
