import { createIcon } from "../icon.js";

const definition = {
  name: "circle-stop",
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
 * Creates the circle-stop icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleStop(options) {
  return createIcon(definition, options);
}

export default CircleStop;
