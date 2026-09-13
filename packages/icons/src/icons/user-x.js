import { createIcon } from "../icon.js";

const definition = {
  name: "user-x",
  nodes: [
    [
      "path",
      {
        d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
      },
    ],
    [
      "circle",
      {
        cx: "9",
        cy: "7",
        r: "4",
      },
    ],
    [
      "line",
      {
        x1: "17",
        x2: "22",
        y1: "8",
        y2: "13",
      },
    ],
    [
      "line",
      {
        x1: "22",
        x2: "17",
        y1: "8",
        y2: "13",
      },
    ],
  ],
};

/**
 * Creates the user-x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UserX(options) {
  return createIcon(definition, options);
}

export default UserX;
