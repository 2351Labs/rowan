import { createIcon } from "../icon.js";

const definition = {
  name: "user-square",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "10",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2",
      },
    ],
  ],
};

/**
 * Creates the user-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UserSquare(options) {
  return createIcon(definition, options);
}

export default UserSquare;
