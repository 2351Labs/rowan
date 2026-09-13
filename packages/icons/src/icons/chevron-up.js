import { createIcon } from "../icon.js";

const definition = {
  name: "chevron-up",
  nodes: [
    [
      "path",
      {
        d: "m18 15-6-6-6 6",
      },
    ],
  ],
};

/**
 * Creates the chevron-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronUp(options) {
  return createIcon(definition, options);
}

export default ChevronUp;
