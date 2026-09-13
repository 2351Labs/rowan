import { createIcon } from "../icon.js";

const definition = {
  name: "zodiac-aries",
  nodes: [
    [
      "path",
      {
        d: "M12 7.5a4.5 4.5 0 1 1 5 4.5",
      },
    ],
    [
      "path",
      {
        d: "M7 12a4.5 4.5 0 1 1 5-4.5V21",
      },
    ],
  ],
};

/**
 * Creates the zodiac-aries icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ZodiacAries(options) {
  return createIcon(definition, options);
}

export default ZodiacAries;
