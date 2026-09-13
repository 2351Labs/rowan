import { createIcon } from "../icon.js";

const definition = {
  name: "layout",
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
        d: "M9 21V9",
      },
    ],
  ],
};

/**
 * Creates the layout icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Layout(options) {
  return createIcon(definition, options);
}

export default Layout;
