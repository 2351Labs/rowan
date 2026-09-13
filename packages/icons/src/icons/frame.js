import { createIcon } from "../icon.js";

const definition = {
  name: "frame",
  nodes: [
    [
      "line",
      {
        x1: "22",
        x2: "2",
        y1: "6",
        y2: "6",
      },
    ],
    [
      "line",
      {
        x1: "22",
        x2: "2",
        y1: "18",
        y2: "18",
      },
    ],
    [
      "line",
      {
        x1: "6",
        x2: "6",
        y1: "2",
        y2: "22",
      },
    ],
    [
      "line",
      {
        x1: "18",
        x2: "18",
        y1: "2",
        y2: "22",
      },
    ],
  ],
};

/**
 * Creates the frame icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Frame(options) {
  return createIcon(definition, options);
}

export default Frame;
