import { createIcon } from "../icon.js";

const definition = {
  name: "user-round-plus",
  nodes: [
    [
      "path",
      {
        d: "M2 21a8 8 0 0 1 13.292-6",
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
      "path",
      {
        d: "M19 16v6",
      },
    ],
    [
      "path",
      {
        d: "M22 19h-6",
      },
    ],
  ],
};

/**
 * Creates the user-round-plus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UserRoundPlus(options) {
  return createIcon(definition, options);
}

export default UserRoundPlus;
