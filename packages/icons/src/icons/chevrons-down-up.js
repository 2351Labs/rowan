import { createIcon } from "../icon.js";

const definition = {
  name: "chevrons-down-up",
  nodes: [
    [
      "path",
      {
        d: "m7 20 5-5 5 5",
      },
    ],
    [
      "path",
      {
        d: "m7 4 5 5 5-5",
      },
    ],
  ],
};

/**
 * Creates the chevrons-down-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronsDownUp(options) {
  return createIcon(definition, options);
}

export default ChevronsDownUp;
