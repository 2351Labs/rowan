import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-from-line",
  nodes: [
    [
      "path",
      {
        d: "m18 9-6-6-6 6",
      },
    ],
    [
      "path",
      {
        d: "M12 3v14",
      },
    ],
    [
      "path",
      {
        d: "M5 21h14",
      },
    ],
  ],
};

/**
 * Creates the arrow-up-from-line icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpFromLine(options) {
  return createIcon(definition, options);
}

export default ArrowUpFromLine;
