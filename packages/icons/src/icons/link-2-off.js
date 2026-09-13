import { createIcon } from "../icon.js";

const definition = {
  name: "link-2-off",
  nodes: [
    [
      "path",
      {
        d: "M9 17H7A5 5 0 0 1 7 7",
      },
    ],
    [
      "path",
      {
        d: "M15 7h2a5 5 0 0 1 4 8",
      },
    ],
    [
      "line",
      {
        x1: "8",
        x2: "12",
        y1: "12",
        y2: "12",
      },
    ],
    [
      "line",
      {
        x1: "2",
        x2: "22",
        y1: "2",
        y2: "22",
      },
    ],
  ],
};

/**
 * Creates the link-2-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Link2Off(options) {
  return createIcon(definition, options);
}

export default Link2Off;
