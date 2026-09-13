import { createIcon } from "../icon.js";

const definition = {
  name: "git-pull-request-draft",
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
        d: "M18 6V5",
      },
    ],
    [
      "path",
      {
        d: "M18 11v-1",
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
 * Creates the git-pull-request-draft icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GitPullRequestDraft(options) {
  return createIcon(definition, options);
}

export default GitPullRequestDraft;
