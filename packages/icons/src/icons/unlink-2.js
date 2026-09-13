import { createIcon } from "../icon.js";

const definition = {
  name: "unlink-2",
  nodes: [
    [
      "path",
      {
        d: "M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2",
      },
    ],
  ],
};

/**
 * Creates the unlink-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Unlink2(options) {
  return createIcon(definition, options);
}

export default Unlink2;
