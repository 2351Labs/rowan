import { createIcon } from "../icon.js";

const definition = {
  name: "zoom-in",
  nodes: [
    [
      "circle",
      {
        cx: "11",
        cy: "11",
        r: "8",
      },
    ],
    [
      "line",
      {
        x1: "21",
        x2: "16.65",
        y1: "21",
        y2: "16.65",
      },
    ],
    [
      "line",
      {
        x1: "11",
        x2: "11",
        y1: "8",
        y2: "14",
      },
    ],
    [
      "line",
      {
        x1: "8",
        x2: "14",
        y1: "11",
        y2: "11",
      },
    ],
  ],
};

/**
 * Creates the zoom-in icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ZoomIn(options) {
  return createIcon(definition, options);
}

export default ZoomIn;
