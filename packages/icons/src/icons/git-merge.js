import { createIcon } from "../icon.js";

const definition = {
  name: "git-merge",
  nodes: [
    [
      "circle",
      {
        cx: "18",
        cy: "18",
        r: "3",
      },
    ],
    [
      "circle",
      {
        cx: "6",
        cy: "6",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "M6 21V9a9 9 0 0 0 9 9",
      },
    ],
  ],
};

/**
 * Creates the git-merge icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GitMerge(options) {
  return createIcon(definition, options);
}

export default GitMerge;
