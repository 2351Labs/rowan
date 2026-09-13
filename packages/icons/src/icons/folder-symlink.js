import { createIcon } from "../icon.js";

const definition = {
  name: "folder-symlink",
  nodes: [
    [
      "path",
      {
        d: "M2 9.35V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7",
      },
    ],
    [
      "path",
      {
        d: "m8 16 3-3-3-3",
      },
    ],
  ],
};

/**
 * Creates the folder-symlink icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FolderSymlink(options) {
  return createIcon(definition, options);
}

export default FolderSymlink;
