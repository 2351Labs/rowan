import { createIcon } from "../icon.js";

const definition = {
  name: "panel-bottom-open",
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
        d: "m9 10 3-3 3 3",
      },
    ],
  ],
};

/**
 * Creates the panel-bottom-open icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelBottomOpen(options) {
  return createIcon(definition, options);
}

export default PanelBottomOpen;
