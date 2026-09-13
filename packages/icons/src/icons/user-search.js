import { createIcon } from "../icon.js";

const definition = {
  name: "user-search",
  nodes: [
    [
      "circle",
      {
        cx: "10",
        cy: "7",
        r: "4",
      },
    ],
    [
      "path",
      {
        d: "M10.3 15H7a4 4 0 0 0-4 4v2",
      },
    ],
    [
      "circle",
      {
        cx: "17",
        cy: "17",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "m21 21-1.9-1.9",
      },
    ],
  ],
};

/**
 * Creates the user-search icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UserSearch(options) {
  return createIcon(definition, options);
}

export default UserSearch;
