import { createIcon } from "../icon.js";

const definition = {
  name: "git-commit-vertical",
  nodes: [
    [
      "path",
      {
        d: "M12 3v6",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "M12 15v6",
      },
    ],
  ],
};

/**
 * Creates the git-commit-vertical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GitCommitVertical(options) {
  return createIcon(definition, options);
}

export default GitCommitVertical;
