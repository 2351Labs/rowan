import { createIcon } from "../icon.js";

const definition = {
  name: "zodiac-libra",
  nodes: [
    [
      "path",
      {
        d: "M3 16h6.857c.162-.012.19-.323.038-.38a6 6 0 1 1 4.212 0c-.153.057-.125.368.038.38H21",
      },
    ],
    [
      "path",
      {
        d: "M3 20h18",
      },
    ],
  ],
};

/**
 * Creates the zodiac-libra icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ZodiacLibra(options) {
  return createIcon(definition, options);
}

export default ZodiacLibra;
