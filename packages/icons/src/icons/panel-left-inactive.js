import { createIcon } from "../icon.js";

const definition = {
  name: "panel-left-inactive",
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
        d: "M9 14v1",
      },
    ],
    [
      "path",
      {
        d: "M9 19v2",
      },
    ],
    [
      "path",
      {
        d: "M9 3v2",
      },
    ],
    [
      "path",
      {
        d: "M9 9v1",
      },
    ],
  ],
};

/**
 * Creates the panel-left-inactive icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelLeftInactive(options) {
  return createIcon(definition, options);
}

export default PanelLeftInactive;
