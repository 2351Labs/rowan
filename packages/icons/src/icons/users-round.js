import { createIcon } from "../icon.js";

const definition = {
  name: "users-round",
  nodes: [
    [
      "path",
      {
        d: "M18 21a8 8 0 0 0-16 0",
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
        d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3",
      },
    ],
  ],
};

/**
 * Creates the users-round icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UsersRound(options) {
  return createIcon(definition, options);
}

export default UsersRound;
