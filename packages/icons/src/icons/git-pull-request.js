import { createIcon } from "../icon.js";

const definition = {
  name: "git-pull-request",
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
        d: "M13 6h3a2 2 0 0 1 2 2v7",
      },
    ],
    [
      "line",
      {
        x1: "6",
        x2: "6",
        y1: "9",
        y2: "21",
      },
    ],
  ],
};

/**
 * Creates the git-pull-request icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GitPullRequest(options) {
  return createIcon(definition, options);
}

export default GitPullRequest;
