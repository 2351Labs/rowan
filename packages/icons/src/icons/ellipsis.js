import { createIcon } from "../icon.js";

const definition = {
  name: "ellipsis",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "19",
        cy: "12",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "5",
        cy: "12",
        r: "1",
      },
    ],
  ],
};

/**
 * Creates the ellipsis icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Ellipsis(options) {
  return createIcon(definition, options);
}

export default Ellipsis;
