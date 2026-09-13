import { createIcon } from "../icon.js";

const definition = {
  name: "table-cells-split",
  nodes: [
    [
      "path",
      {
        d: "M12 15V9",
      },
    ],
    [
      "path",
      {
        d: "M3 15h18",
      },
    ],
    [
      "path",
      {
        d: "M3 9h18",
      },
    ],
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
  ],
};

/**
 * Creates the table-cells-split icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TableCellsSplit(options) {
  return createIcon(definition, options);
}

export default TableCellsSplit;
