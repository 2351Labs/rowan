import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-to-line",
  nodes: [
    [
      "path",
      {
        d: "M5 3h14",
      },
    ],
    [
      "path",
      {
        d: "m18 13-6-6-6 6",
      },
    ],
    [
      "path",
      {
        d: "M12 7v14",
      },
    ],
  ],
};

/**
 * Creates the arrow-up-to-line icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpToLine(options) {
  return createIcon(definition, options);
}

export default ArrowUpToLine;
