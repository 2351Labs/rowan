import { createIcon } from "../icon.js";

const definition = {
  name: "minimize-2",
  nodes: [
    [
      "path",
      {
        d: "m14 10 7-7",
      },
    ],
    [
      "path",
      {
        d: "M20 10h-6V4",
      },
    ],
    [
      "path",
      {
        d: "m3 21 7-7",
      },
    ],
    [
      "path",
      {
        d: "M4 14h6v6",
      },
    ],
  ],
};

/**
 * Creates the minimize-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Minimize2(options) {
  return createIcon(definition, options);
}

export default Minimize2;
