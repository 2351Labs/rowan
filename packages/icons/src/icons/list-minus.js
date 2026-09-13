import { createIcon } from "../icon.js";

const definition = {
  name: "list-minus",
  nodes: [
    [
      "path",
      {
        d: "M16 5H3",
      },
    ],
    [
      "path",
      {
        d: "M11 12H3",
      },
    ],
    [
      "path",
      {
        d: "M16 19H3",
      },
    ],
    [
      "path",
      {
        d: "M21 12h-6",
      },
    ],
  ],
};

/**
 * Creates the list-minus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListMinus(options) {
  return createIcon(definition, options);
}

export default ListMinus;
