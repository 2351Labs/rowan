import { createIcon } from "../icon.js";

const definition = {
  name: "code",
  nodes: [
    [
      "path",
      {
        d: "m16 18 6-6-6-6",
      },
    ],
    [
      "path",
      {
        d: "m8 6-6 6 6 6",
      },
    ],
  ],
};

/**
 * Creates the code icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Code(options) {
  return createIcon(definition, options);
}

export default Code;
