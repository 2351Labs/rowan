import { createIcon } from "../icon.js";

const definition = {
  name: "pause-circle",
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
        x1: "10",
        x2: "10",
        y1: "15",
        y2: "9",
      },
    ],
    [
      "line",
      {
        x1: "14",
        x2: "14",
        y1: "15",
        y2: "9",
      },
    ],
  ],
};

/**
 * Creates the pause-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PauseCircle(options) {
  return createIcon(definition, options);
}

export default PauseCircle;
