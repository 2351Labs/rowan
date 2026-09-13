import { createIcon } from "../icon.js";

const definition = {
  name: "panel-right",
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
  ],
};

/**
 * Creates the panel-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelRight(options) {
  return createIcon(definition, options);
}

export default PanelRight;
