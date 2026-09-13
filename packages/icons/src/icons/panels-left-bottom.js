import { createIcon } from "../icon.js";

const definition = {
  name: "panels-left-bottom",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M9 3v18",
      },
    ],
    [
      "path",
      {
        d: "M9 15h12",
      },
    ],
  ],
};

/**
 * Creates the panels-left-bottom icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelsLeftBottom(options) {
  return createIcon(definition, options);
}

export default PanelsLeftBottom;
