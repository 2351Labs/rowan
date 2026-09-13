import { createIcon } from "../icon.js";

const definition = {
  name: "file-symlink",
  nodes: [
    [
      "path",
      {
        d: "M4 11V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7",
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
        d: "m10 18 3-3-3-3",
      },
    ],
  ],
};

/**
 * Creates the file-symlink icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FileSymlink(options) {
  return createIcon(definition, options);
}

export default FileSymlink;
