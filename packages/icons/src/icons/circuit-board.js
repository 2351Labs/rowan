import { createIcon } from "../icon.js";

const definition = {
  name: "circuit-board",
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
        d: "M11 9h4a2 2 0 0 0 2-2V3",
      },
    ],
    [
      "circle",
      {
        cx: "9",
        cy: "9",
        r: "2",
      },
    ],
    [
      "path",
      {
        d: "M7 21v-4a2 2 0 0 1 2-2h4",
      },
    ],
    [
      "circle",
      {
        cx: "15",
        cy: "15",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the circuit-board icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircuitBoard(options) {
  return createIcon(definition, options);
}

export default CircuitBoard;
