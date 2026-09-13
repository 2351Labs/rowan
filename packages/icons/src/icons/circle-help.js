import { createIcon } from "../icon.js";

const definition = {
  name: "circle-help",
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
        d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
      },
    ],
    [
      "path",
      {
        d: "M12 17h.01",
      },
    ],
  ],
};

/**
 * Creates the circle-help icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleHelp(options) {
  return createIcon(definition, options);
}

export default CircleHelp;
