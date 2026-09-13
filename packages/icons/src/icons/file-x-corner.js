import { createIcon } from "../icon.js";

const definition = {
  name: "file-x-corner",
  nodes: [
    [
      "path",
      {
        d: "M11 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5",
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
        d: "m15 17 5 5",
      },
    ],
    [
      "path",
      {
        d: "m20 17-5 5",
      },
    ],
  ],
};

/**
 * Creates the file-x-corner icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FileXCorner(options) {
  return createIcon(definition, options);
}

export default FileXCorner;
