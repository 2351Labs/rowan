import { createIcon } from "../icon.js";

const definition = {
  name: "user-round",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "8",
        r: "5",
      },
    ],
    [
      "path",
      {
        d: "M20 21a8 8 0 0 0-16 0",
      },
    ],
  ],
};

/**
 * Creates the user-round icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UserRound(options) {
  return createIcon(definition, options);
}

export default UserRound;
