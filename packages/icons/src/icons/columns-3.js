import { createIcon } from "../icon.js";

const definition = {
  name: "columns-3",
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
        d: "M15 3v18",
      },
    ],
  ],
};

/**
 * Creates the columns-3 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Columns3(options) {
  return createIcon(definition, options);
}

export default Columns3;
