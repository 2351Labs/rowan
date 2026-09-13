import { createIcon } from "../icon.js";

const definition = {
  name: "layout-list",
  nodes: [
    [
      "rect",
      {
        width: "7",
        height: "7",
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
        x: "3",
        y: "14",
        rx: "1",
      },
    ],
    [
      "path",
      {
        d: "M14 4h7",
      },
    ],
    [
      "path",
      {
        d: "M14 9h7",
      },
    ],
    [
      "path",
      {
        d: "M14 15h7",
      },
    ],
    [
      "path",
      {
        d: "M14 20h7",
      },
    ],
  ],
};

/**
 * Creates the layout-list icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LayoutList(options) {
  return createIcon(definition, options);
}

export default LayoutList;
