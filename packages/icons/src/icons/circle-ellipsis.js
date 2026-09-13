import { createIcon } from "../icon.js";

const definition = {
  name: "circle-ellipsis",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "M17 12h.01",
      },
    ],
    [
      "path",
      {
        d: "M12 12h.01",
      },
    ],
    [
      "path",
      {
        d: "M7 12h.01",
      },
    ],
  ],
};

/**
 * Creates the circle-ellipsis icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleEllipsis(options) {
  return createIcon(definition, options);
}

export default CircleEllipsis;
