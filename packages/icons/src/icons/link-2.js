import { createIcon } from "../icon.js";

const definition = {
  name: "link-2",
  nodes: [
    [
      "path",
      {
        d: "M9 17H7A5 5 0 0 1 7 7h2",
      },
    ],
    [
      "path",
      {
        d: "M15 7h2a5 5 0 1 1 0 10h-2",
      },
    ],
    [
      "line",
      {
        x1: "8",
        x2: "16",
        y1: "12",
        y2: "12",
      },
    ],
  ],
};

/**
 * Creates the link-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Link2(options) {
  return createIcon(definition, options);
}

export default Link2;
