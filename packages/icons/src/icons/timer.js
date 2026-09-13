import { createIcon } from "../icon.js";

const definition = {
  name: "timer",
  nodes: [
    [
      "line",
      {
        x1: "10",
        x2: "14",
        y1: "2",
        y2: "2",
      },
    ],
    [
      "line",
      {
        x1: "12",
        x2: "15",
        y1: "14",
        y2: "11",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "14",
        r: "8",
      },
    ],
  ],
};

/**
 * Creates the timer icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Timer(options) {
  return createIcon(definition, options);
}

export default Timer;
