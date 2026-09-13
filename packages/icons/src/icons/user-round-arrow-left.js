import { createIcon } from "../icon.js";

const definition = {
  name: "user-round-arrow-left",
  nodes: [
    [
      "path",
      {
        d: "m19 16-3 3",
      },
    ],
    [
      "path",
      {
        d: "M2 21a8 8 0 0 1 12.664-6.5",
      },
    ],
    [
      "path",
      {
        d: "M22 19h-6l3 3",
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
 * Creates the user-round-arrow-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UserRoundArrowLeft(options) {
  return createIcon(definition, options);
}

export default UserRoundArrowLeft;
