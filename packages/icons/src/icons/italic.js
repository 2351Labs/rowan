import { createIcon } from "../icon.js";

const definition = {
  name: "italic",
  nodes: [
    [
      "line",
      {
        x1: "19",
        x2: "10",
        y1: "4",
        y2: "4",
      },
    ],
    [
      "line",
      {
        x1: "14",
        x2: "5",
        y1: "20",
        y2: "20",
      },
    ],
    [
      "line",
      {
        x1: "15",
        x2: "9",
        y1: "4",
        y2: "20",
      },
    ],
  ],
};

/**
 * Creates the italic icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Italic(options) {
  return createIcon(definition, options);
}

export default Italic;
