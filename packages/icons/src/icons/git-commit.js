import { createIcon } from "../icon.js";

const definition = {
  name: "git-commit",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "3",
      },
    ],
    [
      "line",
      {
        x1: "3",
        x2: "9",
        y1: "12",
        y2: "12",
      },
    ],
    [
      "line",
      {
        x1: "15",
        x2: "21",
        y1: "12",
        y2: "12",
      },
    ],
  ],
};

/**
 * Creates the git-commit icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GitCommit(options) {
  return createIcon(definition, options);
}

export default GitCommit;
