import { createIcon } from "../icon.js";

const definition = {
  name: "meh",
  nodes: [
    [
      "path",
      {
        d: "M15 10V9",
      },
    ],
    [
      "path",
      {
        d: "M8 16h8",
      },
    ],
    [
      "path",
      {
        d: "M9 10V9",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
  ],
};

/**
 * Creates the meh icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Meh(options) {
  return createIcon(definition, options);
}

export default Meh;
