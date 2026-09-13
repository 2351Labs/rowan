import { createIcon } from "../icon.js";

const definition = {
  name: "columns-4",
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
        d: "M7.5 3v18",
      },
    ],
    [
      "path",
      {
        d: "M12 3v18",
      },
    ],
    [
      "path",
      {
        d: "M16.5 3v18",
      },
    ],
  ],
};

/**
 * Creates the columns-4 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Columns4(options) {
  return createIcon(definition, options);
}

export default Columns4;
