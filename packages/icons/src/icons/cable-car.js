import { createIcon } from "../icon.js";

const definition = {
  name: "cable-car",
  nodes: [
    [
      "path",
      {
        d: "M10 3h.01",
      },
    ],
    [
      "path",
      {
        d: "M14 2h.01",
      },
    ],
    [
      "path",
      {
        d: "m2 9 20-5",
      },
    ],
    [
      "path",
      {
        d: "M12 12V6.5",
      },
    ],
    [
      "rect",
      {
        width: "16",
        height: "10",
        x: "4",
        y: "12",
        rx: "3",
      },
    ],
    [
      "path",
      {
        d: "M9 12v5",
      },
    ],
    [
      "path",
      {
        d: "M15 12v5",
      },
    ],
    [
      "path",
      {
        d: "M4 17h16",
      },
    ],
  ],
};

/**
 * Creates the cable-car icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CableCar(options) {
  return createIcon(definition, options);
}

export default CableCar;
