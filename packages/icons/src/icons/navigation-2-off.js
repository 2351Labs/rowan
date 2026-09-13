import { createIcon } from "../icon.js";

const definition = {
  name: "navigation-2-off",
  nodes: [
    [
      "path",
      {
        d: "M9.31 9.31 5 21l7-4 7 4-1.17-3.17",
      },
    ],
    [
      "path",
      {
        d: "M14.53 8.88 12 2l-1.17 3.17",
      },
    ],
    [
      "line",
      {
        x1: "2",
        x2: "22",
        y1: "2",
        y2: "22",
      },
    ],
  ],
};

/**
 * Creates the navigation-2-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Navigation2Off(options) {
  return createIcon(definition, options);
}

export default Navigation2Off;
