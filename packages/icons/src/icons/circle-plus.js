import { createIcon } from "../icon.js";

const definition = {
  name: "circle-plus",
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
        d: "M8 12h8",
      },
    ],
    [
      "path",
      {
        d: "M12 8v8",
      },
    ],
  ],
};

/**
 * Creates the circle-plus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CirclePlus(options) {
  return createIcon(definition, options);
}

export default CirclePlus;
