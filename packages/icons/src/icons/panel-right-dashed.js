import { createIcon } from "../icon.js";

const definition = {
  name: "panel-right-dashed",
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
        d: "M15 14v1",
      },
    ],
    [
      "path",
      {
        d: "M15 19v2",
      },
    ],
    [
      "path",
      {
        d: "M15 3v2",
      },
    ],
    [
      "path",
      {
        d: "M15 9v1",
      },
    ],
  ],
};

/**
 * Creates the panel-right-dashed icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelRightDashed(options) {
  return createIcon(definition, options);
}

export default PanelRightDashed;
