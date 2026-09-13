import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-down-from-line",
  nodes: [
    [
      "path",
      {
        d: "M19 3H5",
      },
    ],
    [
      "path",
      {
        d: "M12 21V7",
      },
    ],
    [
      "path",
      {
        d: "m6 15 6 6 6-6",
      },
    ],
  ],
};

/**
 * Creates the arrow-down-from-line icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowDownFromLine(options) {
  return createIcon(definition, options);
}

export default ArrowDownFromLine;
