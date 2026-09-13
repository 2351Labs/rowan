import { createIcon } from "../icon.js";

const definition = {
  name: "list",
  nodes: [
    [
      "path",
      {
        d: "M3 5h.01",
      },
    ],
    [
      "path",
      {
        d: "M3 12h.01",
      },
    ],
    [
      "path",
      {
        d: "M3 19h.01",
      },
    ],
    [
      "path",
      {
        d: "M8 5h13",
      },
    ],
    [
      "path",
      {
        d: "M8 12h13",
      },
    ],
    [
      "path",
      {
        d: "M8 19h13",
      },
    ],
  ],
};

/**
 * Creates the list icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function List(options) {
  return createIcon(definition, options);
}

export default List;
