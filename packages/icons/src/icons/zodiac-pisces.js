import { createIcon } from "../icon.js";

const definition = {
  name: "zodiac-pisces",
  nodes: [
    [
      "path",
      {
        d: "M19 21a15 15 0 0 1 0-18",
      },
    ],
    [
      "path",
      {
        d: "M20 12H4",
      },
    ],
    [
      "path",
      {
        d: "M5 3a15 15 0 0 1 0 18",
      },
    ],
  ],
};

/**
 * Creates the zodiac-pisces icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ZodiacPisces(options) {
  return createIcon(definition, options);
}

export default ZodiacPisces;
