import { createIcon } from "../icon.js";

const definition = {
  name: "proportions",
  nodes: [
    [
      "rect",
      {
        width: "20",
        height: "16",
        x: "2",
        y: "4",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M12 9v11",
      },
    ],
    [
      "path",
      {
        d: "M2 9h13a2 2 0 0 1 2 2v9",
      },
    ],
  ],
};

/**
 * Creates the proportions icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Proportions(options) {
  return createIcon(definition, options);
}

export default Proportions;
