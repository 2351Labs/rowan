import { createIcon } from "../icon.js";

const definition = {
  name: "line-dot-right-horizontal",
  nodes: [
    [
      "path",
      {
        d: "M 3 12 L 15 12",
      },
    ],
    [
      "circle",
      {
        cx: "18",
        cy: "12",
        r: "3",
      },
    ],
  ],
};

/**
 * Creates the line-dot-right-horizontal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LineDotRightHorizontal(options) {
  return createIcon(definition, options);
}

export default LineDotRightHorizontal;
