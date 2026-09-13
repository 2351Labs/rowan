import { createIcon } from "../icon.js";

const definition = {
  name: "highlighter",
  nodes: [
    [
      "path",
      {
        d: "m9 11-6 6v3h9l3-3",
      },
    ],
    [
      "path",
      {
        d: "m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4",
      },
    ],
  ],
};

/**
 * Creates the highlighter icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Highlighter(options) {
  return createIcon(definition, options);
}

export default Highlighter;
