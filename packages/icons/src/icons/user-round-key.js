import { createIcon } from "../icon.js";

const definition = {
  name: "user-round-key",
  nodes: [
    [
      "path",
      {
        d: "M19 11v6",
      },
    ],
    [
      "path",
      {
        d: "M19 13h2",
      },
    ],
    [
      "path",
      {
        d: "M2 21a8 8 0 0 1 12.868-6.349",
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
    [
      "circle",
      {
        cx: "19",
        cy: "19",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the user-round-key icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UserRoundKey(options) {
  return createIcon(definition, options);
}

export default UserRoundKey;
