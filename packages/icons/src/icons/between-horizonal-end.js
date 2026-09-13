import { createIcon } from "../icon.js";

const definition = {
  name: "between-horizonal-end",
  nodes: [
    [
      "rect",
      {
        width: "13",
        height: "7",
        x: "3",
        y: "3",
        rx: "1",
      },
    ],
    [
      "path",
      {
        d: "m22 15-3-3 3-3",
      },
    ],
    [
      "rect",
      {
        width: "13",
        height: "7",
        x: "3",
        y: "14",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the between-horizonal-end icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BetweenHorizonalEnd(options) {
  return createIcon(definition, options);
}

export default BetweenHorizonalEnd;
