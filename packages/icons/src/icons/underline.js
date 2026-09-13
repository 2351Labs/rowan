import { createIcon } from "../icon.js";

const definition = {
  name: "underline",
  nodes: [
    [
      "path",
      {
        d: "M6 4v6a6 6 0 0 0 12 0V4",
      },
    ],
    [
      "line",
      {
        x1: "4",
        x2: "20",
        y1: "20",
        y2: "20",
      },
    ],
  ],
};

/**
 * Creates the underline icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Underline(options) {
  return createIcon(definition, options);
}

export default Underline;
