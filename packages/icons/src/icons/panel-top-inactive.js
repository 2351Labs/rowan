import { createIcon } from "../icon.js";

const definition = {
  name: "panel-top-inactive",
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
        d: "M14 9h1",
      },
    ],
    [
      "path",
      {
        d: "M19 9h2",
      },
    ],
    [
      "path",
      {
        d: "M3 9h2",
      },
    ],
    [
      "path",
      {
        d: "M9 9h1",
      },
    ],
  ],
};

/**
 * Creates the panel-top-inactive icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelTopInactive(options) {
  return createIcon(definition, options);
}

export default PanelTopInactive;
