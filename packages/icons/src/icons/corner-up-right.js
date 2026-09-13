import { createIcon } from "../icon.js";

const definition = {
  name: "corner-up-right",
  nodes: [
    [
      "path",
      {
        d: "m15 14 5-5-5-5",
      },
    ],
    [
      "path",
      {
        d: "M4 20v-7a4 4 0 0 1 4-4h12",
      },
    ],
  ],
};

/**
 * Creates the corner-up-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CornerUpRight(options) {
  return createIcon(definition, options);
}

export default CornerUpRight;
