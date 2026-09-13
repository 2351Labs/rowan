import { createIcon } from "../icon.js";

const definition = {
  name: "panel-left-open",
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
        d: "m14 9 3 3-3 3",
      },
    ],
  ],
};

/**
 * Creates the panel-left-open icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelLeftOpen(options) {
  return createIcon(definition, options);
}

export default PanelLeftOpen;
