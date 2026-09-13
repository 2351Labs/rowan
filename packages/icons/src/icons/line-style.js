import { createIcon } from "../icon.js";

const definition = {
  name: "line-style",
  nodes: [
    [
      "path",
      {
        d: "M11 5h2",
      },
    ],
    [
      "path",
      {
        d: "M15 12h6",
      },
    ],
    [
      "path",
      {
        d: "M19 5h2",
      },
    ],
    [
      "path",
      {
        d: "M3 12h6",
      },
    ],
    [
      "path",
      {
        d: "M3 19h18",
      },
    ],
    [
      "path",
      {
        d: "M3 5h2",
      },
    ],
  ],
};

/**
 * Creates the line-style icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LineStyle(options) {
  return createIcon(definition, options);
}

export default LineStyle;
