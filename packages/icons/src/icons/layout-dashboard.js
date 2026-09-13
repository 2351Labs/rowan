import { createIcon } from "../icon.js";

const definition = {
  name: "layout-dashboard",
  nodes: [
    [
      "rect",
      {
        width: "7",
        height: "9",
        x: "3",
        y: "3",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        width: "7",
        height: "5",
        x: "14",
        y: "3",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        width: "7",
        height: "9",
        x: "14",
        y: "12",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        width: "7",
        height: "5",
        x: "3",
        y: "16",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the layout-dashboard icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LayoutDashboard(options) {
  return createIcon(definition, options);
}

export default LayoutDashboard;
