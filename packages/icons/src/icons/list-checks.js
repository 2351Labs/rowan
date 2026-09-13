import { createIcon } from "../icon.js";

const definition = {
  name: "list-checks",
  nodes: [
    [
      "path",
      {
        d: "M13 5h8",
      },
    ],
    [
      "path",
      {
        d: "M13 12h8",
      },
    ],
    [
      "path",
      {
        d: "M13 19h8",
      },
    ],
    [
      "path",
      {
        d: "m3 17 2 2 4-4",
      },
    ],
    [
      "path",
      {
        d: "m3 7 2 2 4-4",
      },
    ],
  ],
};

/**
 * Creates the list-checks icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListChecks(options) {
  return createIcon(definition, options);
}

export default ListChecks;
