import { createIcon } from "../icon.js";

const definition = {
  name: "panel-top-open",
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
    [
      "path",
      {
        d: "m15 14-3 3-3-3",
      },
    ],
  ],
};

/**
 * Creates the panel-top-open icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelTopOpen(options) {
  return createIcon(definition, options);
}

export default PanelTopOpen;
