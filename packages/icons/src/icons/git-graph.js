import { createIcon } from "../icon.js";

const definition = {
  name: "git-graph",
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
        d: "M5 9v6",
      },
    ],
    [
      "circle",
      {
        cx: "5",
        cy: "18",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "M12 3v18",
      },
    ],
    [
      "circle",
      {
        cx: "19",
        cy: "6",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "M16 15.7A9 9 0 0 0 19 9",
      },
    ],
  ],
};

/**
 * Creates the git-graph icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GitGraph(options) {
  return createIcon(definition, options);
}

export default GitGraph;
