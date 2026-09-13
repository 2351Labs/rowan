import { createIcon } from "../icon.js";

const definition = {
  name: "panel-bottom",
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
        d: "M3 15h18",
      },
    ],
  ],
};

/**
 * Creates the panel-bottom icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelBottom(options) {
  return createIcon(definition, options);
}

export default PanelBottom;
