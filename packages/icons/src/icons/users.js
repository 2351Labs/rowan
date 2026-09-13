import { createIcon } from "../icon.js";

const definition = {
  name: "users",
  nodes: [
    [
      "path",
      {
        d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
      },
    ],
    [
      "path",
      {
        d: "M16 3.128a4 4 0 0 1 0 7.744",
      },
    ],
    [
      "path",
      {
        d: "M22 21v-2a4 4 0 0 0-3-3.87",
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
  ],
};

/**
 * Creates the users icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Users(options) {
  return createIcon(definition, options);
}

export default Users;
