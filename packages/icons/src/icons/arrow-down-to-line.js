import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-down-to-line",
  nodes: [
    [
      "path",
      {
        d: "M12 17V3",
      },
    ],
    [
      "path",
      {
        d: "m6 11 6 6 6-6",
      },
    ],
    [
      "path",
      {
        d: "M19 21H5",
      },
    ],
  ],
};

/**
 * Creates the arrow-down-to-line icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowDownToLine(options) {
  return createIcon(definition, options);
}

export default ArrowDownToLine;
