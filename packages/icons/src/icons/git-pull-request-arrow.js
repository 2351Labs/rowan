import { createIcon } from "../icon.js";

const definition = {
  name: "git-pull-request-arrow",
  nodes: [
    [
      "circle",
      {
        cx: "5",
        cy: "6",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "M5 9v12",
      },
    ],
    [
      "circle",
      {
        cx: "19",
        cy: "18",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "m15 9-3-3 3-3",
      },
    ],
    [
      "path",
      {
        d: "M12 6h5a2 2 0 0 1 2 2v7",
      },
    ],
  ],
};

/**
 * Creates the git-pull-request-arrow icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GitPullRequestArrow(options) {
  return createIcon(definition, options);
}

export default GitPullRequestArrow;
