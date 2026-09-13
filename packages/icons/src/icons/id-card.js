import { createIcon } from "../icon.js";

const definition = {
  name: "id-card",
  nodes: [
    [
      "path",
      {
        d: "M13 19a4 4 0 00-8 0",
      },
    ],
    [
      "path",
      {
        d: "M16 10h2",
      },
    ],
    [
      "path",
      {
        d: "M16 14h2",
      },
    ],
    [
      "circle",
      {
        cx: "9",
        cy: "12",
        r: "3",
      },
    ],
    [
      "rect",
      {
        x: "2",
        y: "5",
        width: "20",
        height: "14",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the id-card icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function IdCard(options) {
  return createIcon(definition, options);
}

export default IdCard;
