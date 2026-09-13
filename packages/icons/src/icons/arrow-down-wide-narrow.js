import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-down-wide-narrow",
  nodes: [
    [
      "path",
      {
        d: "m3 16 4 4 4-4",
      },
    ],
    [
      "path",
      {
        d: "M7 20V4",
      },
    ],
    [
      "path",
      {
        d: "M11 4h10",
      },
    ],
    [
      "path",
      {
        d: "M11 8h7",
      },
    ],
    [
      "path",
      {
        d: "M11 12h4",
      },
    ],
  ],
};

/**
 * Creates the arrow-down-wide-narrow icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowDownWideNarrow(options) {
  return createIcon(definition, options);
}

export default ArrowDownWideNarrow;
