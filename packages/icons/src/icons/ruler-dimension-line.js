import { createIcon } from "../icon.js";

const definition = {
  name: "ruler-dimension-line",
  nodes: [
    [
      "path",
      {
        d: "M10 15v-3",
      },
    ],
    [
      "path",
      {
        d: "M14 15v-3",
      },
    ],
    [
      "path",
      {
        d: "M18 15v-3",
      },
    ],
    [
      "path",
      {
        d: "M2 8V4",
      },
    ],
    [
      "path",
      {
        d: "M22 6H2",
      },
    ],
    [
      "path",
      {
        d: "M22 8V4",
      },
    ],
    [
      "path",
      {
        d: "M6 15v-3",
      },
    ],
    [
      "rect",
      {
        x: "2",
        y: "12",
        width: "20",
        height: "8",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the ruler-dimension-line icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function RulerDimensionLine(options) {
  return createIcon(definition, options);
}

export default RulerDimensionLine;
