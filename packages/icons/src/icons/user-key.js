import { createIcon } from "../icon.js";

const definition = {
  name: "user-key",
  nodes: [
    [
      "path",
      {
        d: "M20 11v6",
      },
    ],
    [
      "path",
      {
        d: "M20 13h2",
      },
    ],
    [
      "path",
      {
        d: "M3 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 2.072.578",
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
    [
      "circle",
      {
        cx: "20",
        cy: "19",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the user-key icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UserKey(options) {
  return createIcon(definition, options);
}

export default UserKey;
