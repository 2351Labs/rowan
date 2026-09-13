import { createIcon } from "../icon.js";

const definition = {
  name: "user-pen",
  nodes: [
    [
      "path",
      {
        d: "M11.5 15H7a4 4 0 0 0-4 4v2",
      },
    ],
    [
      "path",
      {
        d: "M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
      },
    ],
    [
      "circle",
      {
        cx: "10",
        cy: "7",
        r: "4",
      },
    ],
  ],
};

/**
 * Creates the user-pen icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UserPen(options) {
  return createIcon(definition, options);
}

export default UserPen;
