import { createIcon } from "../icon.js";

const definition = {
  name: "aperture",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "m14.31 8 5.74 9.94",
      },
    ],
    [
      "path",
      {
        d: "M9.69 8h11.48",
      },
    ],
    [
      "path",
      {
        d: "m7.38 12 5.74-9.94",
      },
    ],
    [
      "path",
      {
        d: "M9.69 16 3.95 6.06",
      },
    ],
    [
      "path",
      {
        d: "M14.31 16H2.83",
      },
    ],
    [
      "path",
      {
        d: "m16.62 12-5.74 9.94",
      },
    ],
  ],
};

/**
 * Creates the aperture icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Aperture(options) {
  return createIcon(definition, options);
}

export default Aperture;
