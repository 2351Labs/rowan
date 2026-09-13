import { createIcon } from "../icon.js";

const definition = {
  name: "rotate-cw",
  nodes: [
    [
      "path",
      {
        d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",
      },
    ],
    [
      "path",
      {
        d: "M21 3v5h-5",
      },
    ],
  ],
};

/**
 * Creates the rotate-cw icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function RotateCw(options) {
  return createIcon(definition, options);
}

export default RotateCw;
