import { createIcon } from "../icon.js";

const definition = {
  name: "sidebar",
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
  ],
};

/**
 * Creates the sidebar icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Sidebar(options) {
  return createIcon(definition, options);
}

export default Sidebar;
