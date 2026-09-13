import { createIcon } from "../icon.js";

const definition = {
  name: "activity-square",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M17 12h-2l-2 5-2-10-2 5H7",
      },
    ],
  ],
};

/**
 * Creates the activity-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ActivitySquare(options) {
  return createIcon(definition, options);
}

export default ActivitySquare;
