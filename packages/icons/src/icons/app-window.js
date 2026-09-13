import { createIcon } from "../icon.js";

const definition = {
  name: "app-window",
  nodes: [
    [
      "rect",
      {
        x: "2",
        y: "4",
        width: "20",
        height: "16",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M10 4v4",
      },
    ],
    [
      "path",
      {
        d: "M2 8h20",
      },
    ],
    [
      "path",
      {
        d: "M6 4v4",
      },
    ],
  ],
};

/**
 * Creates the app-window icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AppWindow(options) {
  return createIcon(definition, options);
}

export default AppWindow;
