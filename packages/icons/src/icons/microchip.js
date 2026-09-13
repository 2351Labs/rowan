import { createIcon } from "../icon.js";

const definition = {
  name: "microchip",
  nodes: [
    [
      "path",
      {
        d: "M10 12h4",
      },
    ],
    [
      "path",
      {
        d: "M10 17h4",
      },
    ],
    [
      "path",
      {
        d: "M10 7h4",
      },
    ],
    [
      "path",
      {
        d: "M18 12h2",
      },
    ],
    [
      "path",
      {
        d: "M18 18h2",
      },
    ],
    [
      "path",
      {
        d: "M18 6h2",
      },
    ],
    [
      "path",
      {
        d: "M4 12h2",
      },
    ],
    [
      "path",
      {
        d: "M4 18h2",
      },
    ],
    [
      "path",
      {
        d: "M4 6h2",
      },
    ],
    [
      "rect",
      {
        x: "6",
        y: "2",
        width: "12",
        height: "20",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the microchip icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Microchip(options) {
  return createIcon(definition, options);
}

export default Microchip;
