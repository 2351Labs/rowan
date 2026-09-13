import { createIcon } from "../icon.js";

const definition = {
  name: "chevrons-down",
  nodes: [
    [
      "path",
      {
        d: "m7 6 5 5 5-5",
      },
    ],
    [
      "path",
      {
        d: "m7 13 5 5 5-5",
      },
    ],
  ],
};

/**
 * Creates the chevrons-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronsDown(options) {
  return createIcon(definition, options);
}

export default ChevronsDown;
