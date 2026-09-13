import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-down",
  nodes: [
    [
      "path",
      {
        d: "M12 5v14",
      },
    ],
    [
      "path",
      {
        d: "m19 12-7 7-7-7",
      },
    ],
  ],
};

/**
 * Creates the arrow-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowDown(options) {
  return createIcon(definition, options);
}

export default ArrowDown;
