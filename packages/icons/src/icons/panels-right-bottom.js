import { createIcon } from "../icon.js";

const definition = {
  name: "panels-right-bottom",
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
        d: "M3 15h12",
      },
    ],
    [
      "path",
      {
        d: "M15 3v18",
      },
    ],
  ],
};

/**
 * Creates the panels-right-bottom icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelsRightBottom(options) {
  return createIcon(definition, options);
}

export default PanelsRightBottom;
