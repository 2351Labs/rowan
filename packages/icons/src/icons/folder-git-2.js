import { createIcon } from "../icon.js";

const definition = {
  name: "folder-git-2",
  nodes: [
    [
      "path",
      {
        d: "M18 19a5 5 0 0 1-5-5v8",
      },
    ],
    [
      "path",
      {
        d: "M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5",
      },
    ],
    [
      "circle",
      {
        cx: "13",
        cy: "12",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "20",
        cy: "19",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the folder-git-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FolderGit2(options) {
  return createIcon(definition, options);
}

export default FolderGit2;
