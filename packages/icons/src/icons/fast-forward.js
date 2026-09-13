import { createIcon } from "../icon.js";

const definition = {
  name: "fast-forward",
  nodes: [
    [
      "path",
      {
        d: "M12 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 12 18z",
      },
    ],
    [
      "path",
      {
        d: "M2 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 2 18z",
      },
    ],
  ],
};

/**
 * Creates the fast-forward icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FastForward(options) {
  return createIcon(definition, options);
}

export default FastForward;
