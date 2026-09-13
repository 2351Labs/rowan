import { createIcon } from "../icon.js";

const definition = {
  name: "copy-slash",
  nodes: [
    [
      "line",
      {
        x1: "12",
        x2: "18",
        y1: "18",
        y2: "12",
      },
    ],
    [
      "rect",
      {
        width: "14",
        height: "14",
        x: "8",
        y: "8",
        rx: "2",
        ry: "2",
      },
    ],
    [
      "path",
      {
        d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
      },
    ],
  ],
};

/**
 * Creates the copy-slash icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CopySlash(options) {
  return createIcon(definition, options);
}

export default CopySlash;
