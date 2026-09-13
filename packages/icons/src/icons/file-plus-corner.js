import { createIcon } from "../icon.js";

const definition = {
  name: "file-plus-corner",
  nodes: [
    [
      "path",
      {
        d: "M11.35 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5.35",
      },
    ],
    [
      "path",
      {
        d: "M14 2v5a1 1 0 0 0 1 1h5",
      },
    ],
    [
      "path",
      {
        d: "M14 19h6",
      },
    ],
    [
      "path",
      {
        d: "M17 16v6",
      },
    ],
  ],
};

/**
 * Creates the file-plus-corner icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FilePlusCorner(options) {
  return createIcon(definition, options);
}

export default FilePlusCorner;
