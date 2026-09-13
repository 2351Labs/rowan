import { createIcon } from "../icon.js";

const definition = {
  name: "user-round-check",
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
        d: "m16 19 2 2 4-4",
      },
    ],
  ],
};

/**
 * Creates the user-round-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UserRoundCheck(options) {
  return createIcon(definition, options);
}

export default UserRoundCheck;
