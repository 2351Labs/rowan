import { createIcon } from "../icon.js";

const definition = {
  name: "ratio",
  nodes: [
    [
      "rect",
      {
        width: "12",
        height: "20",
        x: "6",
        y: "2",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "20",
        height: "12",
        x: "2",
        y: "6",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the ratio icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Ratio(options) {
  return createIcon(definition, options);
}

export default Ratio;
