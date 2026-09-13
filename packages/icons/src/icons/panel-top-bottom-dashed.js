import { createIcon } from "../icon.js";

const definition = {
  name: "panel-top-bottom-dashed",
  nodes: [
    [
      "path",
      {
        d: "M14 15h1",
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
        d: "M19 15h2",
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
        d: "M3 15h2",
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
        d: "M9 15h1",
      },
    ],
    [
      "path",
      {
        d: "M9 9h1",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the panel-top-bottom-dashed icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PanelTopBottomDashed(options) {
  return createIcon(definition, options);
}

export default PanelTopBottomDashed;
