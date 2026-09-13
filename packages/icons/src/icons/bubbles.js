import { createIcon } from "../icon.js";

const definition = {
  name: "bubbles",
  nodes: [
    [
      "path",
      {
        d: "M7.001 15.085A1.5 1.5 0 0 1 9 16.5",
      },
    ],
    [
      "circle",
      {
        cx: "18.5",
        cy: "8.5",
        r: "3.5",
      },
    ],
    [
      "circle",
      {
        cx: "7.5",
        cy: "16.5",
        r: "5.5",
      },
    ],
    [
      "circle",
      {
        cx: "7.5",
        cy: "4.5",
        r: "2.5",
      },
    ],
  ],
};

/**
 * Creates the bubbles icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Bubbles(options) {
  return createIcon(definition, options);
}

export default Bubbles;
