import { createIcon } from "../icon.js";

const definition = {
  name: "columns-2",
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
        d: "M12 3v18",
      },
    ],
  ],
};

/**
 * Creates the columns-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Columns2(options) {
  return createIcon(definition, options);
}

export default Columns2;
