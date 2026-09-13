import { createIcon } from "../icon.js";

const definition = {
  name: "maximize-2",
  nodes: [
    [
      "path",
      {
        d: "M15 3h6v6",
      },
    ],
    [
      "path",
      {
        d: "m21 3-7 7",
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
        d: "M9 21H3v-6",
      },
    ],
  ],
};

/**
 * Creates the maximize-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Maximize2(options) {
  return createIcon(definition, options);
}

export default Maximize2;
