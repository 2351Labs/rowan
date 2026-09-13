import { createIcon } from "../icon.js";

const definition = {
  name: "panel-bottom-close",
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
    [
      "path",
      {
        d: "m15 8-3 3-3-3",
      },
    ],
  ],
};

/**
 * Creates the panel-bottom-close icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelBottomClose(options) {
  return createIcon(definition, options);
}

export default PanelBottomClose;
