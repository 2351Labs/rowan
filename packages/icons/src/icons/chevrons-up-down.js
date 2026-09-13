import { createIcon } from "../icon.js";

const definition = {
  name: "chevrons-up-down",
  nodes: [
    [
      "path",
      {
        d: "m7 15 5 5 5-5",
      },
    ],
    [
      "path",
      {
        d: "m7 9 5-5 5 5",
      },
    ],
  ],
};

/**
 * Creates the chevrons-up-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronsUpDown(options) {
  return createIcon(definition, options);
}

export default ChevronsUpDown;
