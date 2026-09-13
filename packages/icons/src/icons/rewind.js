import { createIcon } from "../icon.js";

const definition = {
  name: "rewind",
  nodes: [
    [
      "path",
      {
        d: "M12 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 12 18z",
      },
    ],
    [
      "path",
      {
        d: "M22 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 22 18z",
      },
    ],
  ],
};

/**
 * Creates the rewind icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Rewind(options) {
  return createIcon(definition, options);
}

export default Rewind;
