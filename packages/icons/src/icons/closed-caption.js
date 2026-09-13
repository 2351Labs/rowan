import { createIcon } from "../icon.js";

const definition = {
  name: "closed-caption",
  nodes: [
    [
      "path",
      {
        d: "M10 9.17a3 3 0 1 0 0 5.66",
      },
    ],
    [
      "path",
      {
        d: "M17 9.17a3 3 0 1 0 0 5.66",
      },
    ],
    [
      "rect",
      {
        x: "2",
        y: "5",
        width: "20",
        height: "14",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the closed-caption icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ClosedCaption(options) {
  return createIcon(definition, options);
}

export default ClosedCaption;
