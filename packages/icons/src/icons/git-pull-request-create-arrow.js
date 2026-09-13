import { createIcon } from "../icon.js";

const definition = {
  name: "git-pull-request-create-arrow",
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
      "path",
      {
        d: "m15 9-3-3 3-3",
      },
    ],
    [
      "path",
      {
        d: "M12 6h5a2 2 0 0 1 2 2v3",
      },
    ],
    [
      "path",
      {
        d: "M19 15v6",
      },
    ],
    [
      "path",
      {
        d: "M22 18h-6",
      },
    ],
  ],
};

/**
 * Creates the git-pull-request-create-arrow icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GitPullRequestCreateArrow(options) {
  return createIcon(definition, options);
}

export default GitPullRequestCreateArrow;
