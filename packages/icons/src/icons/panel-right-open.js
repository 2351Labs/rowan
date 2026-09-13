import { createIcon } from "../icon.js";

const definition = {
  name: "panel-right-open",
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
        d: "M15 3v18",
      },
    ],
    [
      "path",
      {
        d: "m10 15-3-3 3-3",
      },
    ],
  ],
};

/**
 * Creates the panel-right-open icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelRightOpen(options) {
  return createIcon(definition, options);
}

export default PanelRightOpen;
