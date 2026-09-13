import { createIcon } from "../icon.js";

const definition = {
  name: "undo-2",
  nodes: [
    [
      "path",
      {
        d: "M9 14 4 9l5-5",
      },
    ],
    [
      "path",
      {
        d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
      },
    ],
  ],
};

/**
 * Creates the undo-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Undo2(options) {
  return createIcon(definition, options);
}

export default Undo2;
