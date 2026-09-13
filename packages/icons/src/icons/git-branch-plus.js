import { createIcon } from "../icon.js";

const definition = {
  name: "git-branch-plus",
  nodes: [
    [
      "path",
      {
        d: "M6 3v12",
      },
    ],
    [
      "path",
      {
        d: "M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
      },
    ],
    [
      "path",
      {
        d: "M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
      },
    ],
    [
      "path",
      {
        d: "M15 6a9 9 0 0 0-9 9",
      },
    ],
    [
      "path",
      {
        d: "M18 15v6",
      },
    ],
    [
      "path",
      {
        d: "M21 18h-6",
      },
    ],
  ],
};

/**
 * Creates the git-branch-plus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GitBranchPlus(options) {
  return createIcon(definition, options);
}

export default GitBranchPlus;
