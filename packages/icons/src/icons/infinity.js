import { createIcon } from "../icon.js";

const definition = {
  name: "infinity",
  nodes: [
    [
      "path",
      {
        d: "M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8",
      },
    ],
  ],
};

/**
 * Creates the infinity icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
function createInfinity(options) {
  return createIcon(definition, options);
}

export { createInfinity as Infinity };

export default createInfinity;
