import { createIcon } from "../icon.js";

const definition = {
  name: "user-plus-2",
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
 * Creates the user-plus-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UserPlus2(options) {
  return createIcon(definition, options);
}

export default UserPlus2;
