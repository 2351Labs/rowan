import { createIcon } from "../icon.js";

const definition = {
  name: "user",
  nodes: [
    [
      "path",
      {
        d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "7",
        r: "4",
      },
    ],
  ],
};

/**
 * Creates the user icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function User(options) {
  return createIcon(definition, options);
}

export default User;
