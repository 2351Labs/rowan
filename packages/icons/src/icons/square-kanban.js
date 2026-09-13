import { createIcon } from "../icon.js";

const definition = {
  name: "square-kanban",
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
        d: "M8 7v7",
      },
    ],
    [
      "path",
      {
        d: "M12 7v4",
      },
    ],
    [
      "path",
      {
        d: "M16 7v9",
      },
    ],
  ],
};

/**
 * Creates the square-kanban icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareKanban(options) {
  return createIcon(definition, options);
}

export default SquareKanban;
