import { createIcon } from "../icon.js";

const definition = {
  name: "grid-2x2-plus",
  nodes: [
    [
      "path",
      {
        d: "M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3",
      },
    ],
    [
      "path",
      {
        d: "M16 19h6",
      },
    ],
    [
      "path",
      {
        d: "M19 22v-6",
      },
    ],
  ],
};

/**
 * Creates the grid-2x2-plus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Grid2x2Plus(options) {
  return createIcon(definition, options);
}

export default Grid2x2Plus;
