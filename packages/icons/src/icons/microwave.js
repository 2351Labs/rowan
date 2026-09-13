import { createIcon } from "../icon.js";

const definition = {
  name: "microwave",
  nodes: [
    [
      "rect",
      {
        width: "20",
        height: "15",
        x: "2",
        y: "4",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "8",
        height: "7",
        x: "6",
        y: "8",
        rx: "1",
      },
    ],
    [
      "path",
      {
        d: "M18 8v7",
      },
    ],
    [
      "path",
      {
        d: "M6 19v2",
      },
    ],
    [
      "path",
      {
        d: "M18 19v2",
      },
    ],
  ],
};

/**
 * Creates the microwave icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Microwave(options) {
  return createIcon(definition, options);
}

export default Microwave;
