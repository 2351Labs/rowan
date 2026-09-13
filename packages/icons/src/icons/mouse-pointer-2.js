import { createIcon } from "../icon.js";

const definition = {
  name: "mouse-pointer-2",
  nodes: [
    [
      "path",
      {
        d: "M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z",
      },
    ],
  ],
};

/**
 * Creates the mouse-pointer-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MousePointer2(options) {
  return createIcon(definition, options);
}

export default MousePointer2;
