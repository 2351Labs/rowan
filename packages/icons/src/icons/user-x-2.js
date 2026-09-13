import { createIcon } from "../icon.js";

const definition = {
  name: "user-x-2",
  nodes: [
    [
      "path",
      {
        d: "m16.5 16.5 5 5",
      },
    ],
    [
      "path",
      {
        d: "M2 21a8 8 0 0 1 11.531-7.18",
      },
    ],
    [
      "path",
      {
        d: "m21.5 16.5-5 5",
      },
    ],
    [
      "circle",
      {
        cx: "10",
        cy: "8",
        r: "5",
      },
    ],
  ],
};

/**
 * Creates the user-x-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UserX2(options) {
  return createIcon(definition, options);
}

export default UserX2;
