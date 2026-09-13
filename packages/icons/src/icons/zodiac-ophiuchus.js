import { createIcon } from "../icon.js";

const definition = {
  name: "zodiac-ophiuchus",
  nodes: [
    [
      "path",
      {
        d: "M3 10A6.06 6.06 0 0 1 12 10 A6.06 6.06 0 0 0 21 10",
      },
    ],
    [
      "path",
      {
        d: "M6 3v12a6 6 0 0 0 12 0V3",
      },
    ],
  ],
};

/**
 * Creates the zodiac-ophiuchus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ZodiacOphiuchus(options) {
  return createIcon(definition, options);
}

export default ZodiacOphiuchus;
