import { createIcon } from "../icon.js";

const definition = {
  name: "undo",
  nodes: [
    [
      "path",
      {
        d: "M3 7v6h6",
      },
    ],
    [
      "path",
      {
        d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",
      },
    ],
  ],
};

/**
 * Creates the undo icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Undo(options) {
  return createIcon(definition, options);
}

export default Undo;
