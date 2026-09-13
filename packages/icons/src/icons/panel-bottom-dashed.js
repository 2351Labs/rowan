import { createIcon } from "../icon.js";

const definition = {
  name: "panel-bottom-dashed",
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
        d: "M14 15h1",
      },
    ],
    [
      "path",
      {
        d: "M19 15h2",
      },
    ],
    [
      "path",
      {
        d: "M3 15h2",
      },
    ],
    [
      "path",
      {
        d: "M9 15h1",
      },
    ],
  ],
};

/**
 * Creates the panel-bottom-dashed icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelBottomDashed(options) {
  return createIcon(definition, options);
}

export default PanelBottomDashed;
