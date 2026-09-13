import { createIcon } from "../icon.js";

const definition = {
  name: "panel-left-close",
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
        d: "m16 15-3-3 3-3",
      },
    ],
  ],
};

/**
 * Creates the panel-left-close icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelLeftClose(options) {
  return createIcon(definition, options);
}

export default PanelLeftClose;
