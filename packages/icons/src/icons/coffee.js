import { createIcon } from "../icon.js";

const definition = {
  name: "coffee",
  nodes: [
    [
      "path",
      {
        d: "M10 2v2",
      },
    ],
    [
      "path",
      {
        d: "M14 2v2",
      },
    ],
    [
      "path",
      {
        d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",
      },
    ],
    [
      "path",
      {
        d: "M6 2v2",
      },
    ],
  ],
};

/**
 * Creates the coffee icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Coffee(options) {
  return createIcon(definition, options);
}

export default Coffee;
