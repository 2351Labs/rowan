import { createIcon } from "../icon.js";

const definition = {
  name: "layout-template",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "7",
        x: "3",
        y: "3",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        width: "9",
        height: "7",
        x: "3",
        y: "14",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        width: "5",
        height: "7",
        x: "16",
        y: "14",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the layout-template icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LayoutTemplate(options) {
  return createIcon(definition, options);
}

export default LayoutTemplate;
