import { createIcon } from "../icon.js";

const definition = {
  name: "zodiac-leo",
  nodes: [
    [
      "path",
      {
        d: "M10 16c0-4-3-4.5-3-8a5 5 0 0 1 10 0c0 3.466-3 6.196-3 10a3 3 0 0 0 6 0",
      },
    ],
    [
      "circle",
      {
        cx: "7",
        cy: "16",
        r: "3",
      },
    ],
  ],
};

/**
 * Creates the zodiac-leo icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ZodiacLeo(options) {
  return createIcon(definition, options);
}

export default ZodiacLeo;
