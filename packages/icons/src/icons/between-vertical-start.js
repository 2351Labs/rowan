import { createIcon } from "../icon.js";

const definition = {
  name: "between-vertical-start",
  nodes: [
    [
      "rect",
      {
        width: "7",
        height: "13",
        x: "3",
        y: "8",
        rx: "1",
      },
    ],
    [
      "path",
      {
        d: "m15 2-3 3-3-3",
      },
    ],
    [
      "rect",
      {
        width: "7",
        height: "13",
        x: "14",
        y: "8",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the between-vertical-start icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BetweenVerticalStart(options) {
  return createIcon(definition, options);
}

export default BetweenVerticalStart;
