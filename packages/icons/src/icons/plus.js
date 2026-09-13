import { createIcon } from "../icon.js";

const definition = {
  name: "plus",
  nodes: [
    [
      "path",
      {
        d: "M5 12h14",
      },
    ],
    [
      "path",
      {
        d: "M12 5v14",
      },
    ],
  ],
};

/**
 * Creates the plus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Plus(options) {
  return createIcon(definition, options);
}

export default Plus;
