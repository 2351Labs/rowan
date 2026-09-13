import { createIcon } from "../icon.js";

const definition = {
  name: "chevrons-up",
  nodes: [
    [
      "path",
      {
        d: "m17 11-5-5-5 5",
      },
    ],
    [
      "path",
      {
        d: "m17 18-5-5-5 5",
      },
    ],
  ],
};

/**
 * Creates the chevrons-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronsUp(options) {
  return createIcon(definition, options);
}

export default ChevronsUp;
