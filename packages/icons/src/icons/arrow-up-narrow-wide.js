import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-narrow-wide",
  nodes: [
    [
      "path",
      {
        d: "m3 8 4-4 4 4",
      },
    ],
    [
      "path",
      {
        d: "M7 4v16",
      },
    ],
    [
      "path",
      {
        d: "M11 12h4",
      },
    ],
    [
      "path",
      {
        d: "M11 16h7",
      },
    ],
    [
      "path",
      {
        d: "M11 20h10",
      },
    ],
  ],
};

/**
 * Creates the arrow-up-narrow-wide icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpNarrowWide(options) {
  return createIcon(definition, options);
}

export default ArrowUpNarrowWide;
