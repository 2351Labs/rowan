import { createIcon } from "../icon.js";

const definition = {
  name: "circle-euro",
  nodes: [
    [
      "path",
      {
        d: "M15 9.4a4 4 0 1 0 0 5.2",
      },
    ],
    [
      "path",
      {
        d: "M7 12h5",
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
 * Creates the circle-euro icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleEuro(options) {
  return createIcon(definition, options);
}

export default CircleEuro;
