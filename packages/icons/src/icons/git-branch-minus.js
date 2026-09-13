import { createIcon } from "../icon.js";

const definition = {
  name: "git-branch-minus",
  nodes: [
    [
      "path",
      {
        d: "M15 6a9 9 0 0 0-9 9V3",
      },
    ],
    [
      "path",
      {
        d: "M21 18h-6",
      },
    ],
    [
      "circle",
      {
        cx: "18",
        cy: "6",
        r: "3",
      },
    ],
    [
      "circle",
      {
        cx: "6",
        cy: "18",
        r: "3",
      },
    ],
  ],
};

/**
 * Creates the git-branch-minus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GitBranchMinus(options) {
  return createIcon(definition, options);
}

export default GitBranchMinus;
