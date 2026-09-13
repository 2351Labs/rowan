import { createIcon } from "../icon.js";

const definition = {
  name: "panel-top",
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
        d: "M3 9h18",
      },
    ],
  ],
};

/**
 * Creates the panel-top icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelTop(options) {
  return createIcon(definition, options);
}

export default PanelTop;
