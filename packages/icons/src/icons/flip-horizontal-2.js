import { createIcon } from "../icon.js";

const definition = {
  name: "flip-horizontal-2",
  nodes: [
    [
      "path",
      {
        d: "M10 12H8",
      },
    ],
    [
      "path",
      {
        d: "M16 12h-2",
      },
    ],
    [
      "path",
      {
        d: "M22 12h-2",
      },
    ],
    [
      "path",
      {
        d: "M4 12H2",
      },
    ],
    [
      "path",
      {
        d: "M7.298 20.288A1 1 0 008 22h8a1 1 0 00.703-1.712l-3.991-3.99a1 1 0 00-1.424-.001z",
      },
    ],
    [
      "path",
      {
        d: "M7.298 3.712A1 1 0 018 2h8a1 1 0 01.703 1.712l-3.991 3.99a1 1 0 01-1.424.001z",
      },
    ],
  ],
};

/**
 * Creates the flip-horizontal-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FlipHorizontal2(options) {
  return createIcon(definition, options);
}

export default FlipHorizontal2;
