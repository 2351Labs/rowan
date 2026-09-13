import { createIcon } from "../icon.js";

const definition = {
  name: "forward",
  nodes: [
    [
      "path",
      {
        d: "m15 17 5-5-5-5",
      },
    ],
    [
      "path",
      {
        d: "M4 18v-2a4 4 0 0 1 4-4h12",
      },
    ],
  ],
};

/**
 * Creates the forward icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Forward(options) {
  return createIcon(definition, options);
}

export default Forward;
