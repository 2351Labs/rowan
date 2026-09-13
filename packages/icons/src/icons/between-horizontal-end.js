import { createIcon } from "../icon.js";

const definition = {
  name: "between-horizontal-end",
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
 * Creates the between-horizontal-end icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BetweenHorizontalEnd(options) {
  return createIcon(definition, options);
}

export default BetweenHorizontalEnd;
