import { createIcon } from "../icon.js";

const definition = {
  name: "sidebar-close",
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
 * Creates the sidebar-close icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SidebarClose(options) {
  return createIcon(definition, options);
}

export default SidebarClose;
