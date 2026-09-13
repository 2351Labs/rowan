import { createIcon } from "../icon.js";

const definition = {
  name: "layout-panel-left",
  nodes: [
    [
      "rect",
      {
        width: "7",
        height: "18",
        x: "3",
        y: "3",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        width: "7",
        height: "7",
        x: "14",
        y: "3",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        width: "7",
        height: "7",
        x: "14",
        y: "14",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the layout-panel-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LayoutPanelLeft(options) {
  return createIcon(definition, options);
}

export default LayoutPanelLeft;
