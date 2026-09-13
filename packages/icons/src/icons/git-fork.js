import { createIcon } from "../icon.js";

const definition = {
  name: "git-fork",
  nodes: [
    [
      "circle",
      {
        cx: "12",
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
      "circle",
      {
        cx: "18",
        cy: "6",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9",
      },
    ],
    [
      "path",
      {
        d: "M12 12v3",
      },
    ],
  ],
};

/**
 * Creates the git-fork icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GitFork(options) {
  return createIcon(definition, options);
}

export default GitFork;
