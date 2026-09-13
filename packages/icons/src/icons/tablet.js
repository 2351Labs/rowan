import { createIcon } from "../icon.js";

const definition = {
  name: "tablet",
  nodes: [
    [
      "rect",
      {
        width: "16",
        height: "20",
        x: "4",
        y: "2",
        rx: "2",
        ry: "2",
      },
    ],
    [
      "line",
      {
        x1: "12",
        x2: "12.01",
        y1: "18",
        y2: "18",
      },
    ],
  ],
};

/**
 * Creates the tablet icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Tablet(options) {
  return createIcon(definition, options);
}

export default Tablet;
