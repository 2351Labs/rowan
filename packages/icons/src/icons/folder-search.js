import { createIcon } from "../icon.js";

const definition = {
  name: "folder-search",
  nodes: [
    [
      "path",
      {
        d: "M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1",
      },
    ],
    [
      "path",
      {
        d: "m21 21-1.9-1.9",
      },
    ],
    [
      "circle",
      {
        cx: "17",
        cy: "17",
        r: "3",
      },
    ],
  ],
};

/**
 * Creates the folder-search icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FolderSearch(options) {
  return createIcon(definition, options);
}

export default FolderSearch;
