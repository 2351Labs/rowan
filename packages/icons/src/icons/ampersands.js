import { createIcon } from "../icon.js";

const definition = {
  name: "ampersands",
  nodes: [
    [
      "path",
      {
        d: "M10 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5",
      },
    ],
    [
      "path",
      {
        d: "M22 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5",
      },
    ],
  ],
};

/**
 * Creates the ampersands icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Ampersands(options) {
  return createIcon(definition, options);
}

export default Ampersands;
