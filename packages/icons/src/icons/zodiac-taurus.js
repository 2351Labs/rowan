import { createIcon } from "../icon.js";

const definition = {
  name: "zodiac-taurus",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "15",
        r: "6",
      },
    ],
    [
      "path",
      {
        d: "M18 3A6 6 0 0 1 6 3",
      },
    ],
  ],
};

/**
 * Creates the zodiac-taurus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ZodiacTaurus(options) {
  return createIcon(definition, options);
}

export default ZodiacTaurus;
