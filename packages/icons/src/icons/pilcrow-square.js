import { createIcon } from "../icon.js";

const definition = {
  name: "pilcrow-square",
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
        d: "M12 12H9.5a2.5 2.5 0 0 1 0-5H17",
      },
    ],
    [
      "path",
      {
        d: "M12 7v10",
      },
    ],
    [
      "path",
      {
        d: "M16 7v10",
      },
    ],
  ],
};

/**
 * Creates the pilcrow-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PilcrowSquare(options) {
  return createIcon(definition, options);
}

export default PilcrowSquare;
