import { createIcon } from "../icon.js";

const definition = {
  name: "stop-circle",
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
      "rect",
      {
        x: "9",
        y: "9",
        width: "6",
        height: "6",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the stop-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function StopCircle(options) {
  return createIcon(definition, options);
}

export default StopCircle;
