import { createIcon } from "../icon.js";

const definition = {
  name: "app-window-mac",
  nodes: [
    [
      "rect",
      {
        width: "20",
        height: "16",
        x: "2",
        y: "4",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M6 8h.01",
      },
    ],
    [
      "path",
      {
        d: "M10 8h.01",
      },
    ],
    [
      "path",
      {
        d: "M14 8h.01",
      },
    ],
  ],
};

/**
 * Creates the app-window-mac icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AppWindowMac(options) {
  return createIcon(definition, options);
}

export default AppWindowMac;
