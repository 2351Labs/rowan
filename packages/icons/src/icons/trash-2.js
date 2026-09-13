import { createIcon } from "../icon.js";

const definition = {
  name: "trash-2",
  nodes: [
    [
      "path",
      {
        d: "M10 11v6",
      },
    ],
    [
      "path",
      {
        d: "M14 11v6",
      },
    ],
    [
      "path",
      {
        d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
      },
    ],
    [
      "path",
      {
        d: "M3 6h18",
      },
    ],
    [
      "path",
      {
        d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
      },
    ],
  ],
};

/**
 * Creates the trash-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Trash2(options) {
  return createIcon(definition, options);
}

export default Trash2;
