import { createIcon } from "../icon.js";

const definition = {
  name: "server",
  nodes: [
    [
      "rect",
      {
        width: "20",
        height: "8",
        x: "2",
        y: "2",
        rx: "2",
        ry: "2",
      },
    ],
    [
      "rect",
      {
        width: "20",
        height: "8",
        x: "2",
        y: "14",
        rx: "2",
        ry: "2",
      },
    ],
    [
      "line",
      {
        x1: "6",
        x2: "6.01",
        y1: "6",
        y2: "6",
      },
    ],
    [
      "line",
      {
        x1: "6",
        x2: "6.01",
        y1: "18",
        y2: "18",
      },
    ],
  ],
};

/**
 * Creates the server icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Server(options) {
  return createIcon(definition, options);
}

export default Server;
