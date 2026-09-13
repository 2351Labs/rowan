import { createIcon } from "../icon.js";

const definition = {
  name: "banknote",
  nodes: [
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
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "2",
      },
    ],
    [
      "path",
      {
        d: "M6 12h.01M18 12h.01",
      },
    ],
  ],
};

/**
 * Creates the banknote icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Banknote(options) {
  return createIcon(definition, options);
}

export default Banknote;
