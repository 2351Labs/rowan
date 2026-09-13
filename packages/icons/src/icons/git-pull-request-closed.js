import { createIcon } from "../icon.js";

const definition = {
  name: "git-pull-request-closed",
  nodes: [
    [
      "path",
      {
        d: "m15.5 3.5 5 5",
      },
    ],
    [
      "path",
      {
        d: "m15.5 8.5 5-5",
      },
    ],
    [
      "path",
      {
        d: "M18 11.62V15",
      },
    ],
    [
      "path",
      {
        d: "M6 9v12",
      },
    ],
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
  ],
};

/**
 * Creates the git-pull-request-closed icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GitPullRequestClosed(options) {
  return createIcon(definition, options);
}

export default GitPullRequestClosed;
