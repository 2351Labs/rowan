import { createIcon } from "../icon.js";

const definition = {
  name: "venus-and-mars",
  nodes: [
    [
      "path",
      {
        d: "M10 20h4",
      },
    ],
    [
      "path",
      {
        d: "M12 16v6",
      },
    ],
    [
      "path",
      {
        d: "M17 2h4v4",
      },
    ],
    [
      "path",
      {
        d: "m21 2-5.46 5.46",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "11",
        r: "5",
      },
    ],
  ],
};

/**
 * Creates the venus-and-mars icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function VenusAndMars(options) {
  return createIcon(definition, options);
}

export default VenusAndMars;
