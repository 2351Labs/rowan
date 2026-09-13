import { createIcon } from "../icon.js";

const definition = {
  name: "zodiac-cancer",
  nodes: [
    [
      "path",
      {
        d: "M21 14.5A9 6.5 0 0 1 5.5 19",
      },
    ],
    [
      "path",
      {
        d: "M3 9.5A9 6.5 0 0 1 18.5 5",
      },
    ],
    [
      "circle",
      {
        cx: "17.5",
        cy: "14.5",
        r: "3.5",
      },
    ],
    [
      "circle",
      {
        cx: "6.5",
        cy: "9.5",
        r: "3.5",
      },
    ],
  ],
};

/**
 * Creates the zodiac-cancer icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ZodiacCancer(options) {
  return createIcon(definition, options);
}

export default ZodiacCancer;
