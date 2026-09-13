import { createIcon } from "../icon.js";

const definition = {
  name: "between-vertical-end",
  nodes: [
    [
      "rect",
      {
        width: "7",
        height: "13",
        x: "3",
        y: "3",
        rx: "1",
      },
    ],
    [
      "path",
      {
        d: "m9 22 3-3 3 3",
      },
    ],
    [
      "rect",
      {
        width: "7",
        height: "13",
        x: "14",
        y: "3",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the between-vertical-end icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BetweenVerticalEnd(options) {
  return createIcon(definition, options);
}

export default BetweenVerticalEnd;
