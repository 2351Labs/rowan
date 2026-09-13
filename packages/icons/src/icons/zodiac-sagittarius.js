import { createIcon } from "../icon.js";

const definition = {
  name: "zodiac-sagittarius",
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
        d: "M21 3 3 21",
      },
    ],
    [
      "path",
      {
        d: "m9 9 6 6",
      },
    ],
  ],
};

/**
 * Creates the zodiac-sagittarius icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ZodiacSagittarius(options) {
  return createIcon(definition, options);
}

export default ZodiacSagittarius;
