import { createIcon } from "../icon.js";

const definition = {
  name: "brackets",
  nodes: [
    [
      "path",
      {
        d: "M16 3h3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-3",
      },
    ],
    [
      "path",
      {
        d: "M8 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3",
      },
    ],
  ],
};

/**
 * Creates the brackets icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Brackets(options) {
  return createIcon(definition, options);
}

export default Brackets;
