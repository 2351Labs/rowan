import { createIcon } from "../icon.js";

const definition = {
  name: "laptop-minimal-check",
  nodes: [
    [
      "path",
      {
        d: "M2 20h20",
      },
    ],
    [
      "path",
      {
        d: "m9 10 2 2 4-4",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "4",
        width: "18",
        height: "12",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the laptop-minimal-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LaptopMinimalCheck(options) {
  return createIcon(definition, options);
}

export default LaptopMinimalCheck;
