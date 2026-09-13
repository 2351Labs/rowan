import { createIcon } from "../icon.js";

const definition = {
  name: "chevron-down",
  nodes: [
    [
      "path",
      {
        d: "m6 9 6 6 6-6",
      },
    ],
  ],
};

/**
 * Creates the chevron-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronDown(options) {
  return createIcon(definition, options);
}

export default ChevronDown;
