import { createIcon } from "../icon.js";

const definition = {
  name: "grid-2x2-x",
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
        d: "m16.5 16.5 5 5",
      },
    ],
    [
      "path",
      {
        d: "m16.5 21.5 5-5",
      },
    ],
  ],
};

/**
 * Creates the grid-2x2-x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Grid2x2X(options) {
  return createIcon(definition, options);
}

export default Grid2x2X;
