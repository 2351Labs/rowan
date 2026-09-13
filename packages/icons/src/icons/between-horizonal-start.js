import { createIcon } from "../icon.js";

const definition = {
  name: "between-horizonal-start",
  nodes: [
    [
      "rect",
      {
        width: "13",
        height: "7",
        x: "8",
        y: "3",
        rx: "1",
      },
    ],
    [
      "path",
      {
        d: "m2 9 3 3-3 3",
      },
    ],
    [
      "rect",
      {
        width: "13",
        height: "7",
        x: "8",
        y: "14",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the between-horizonal-start icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BetweenHorizonalStart(options) {
  return createIcon(definition, options);
}

export default BetweenHorizonalStart;
