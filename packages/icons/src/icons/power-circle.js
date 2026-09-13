import { createIcon } from "../icon.js";

const definition = {
  name: "power-circle",
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
        d: "M12 7v4",
      },
    ],
    [
      "path",
      {
        d: "M7.998 9.003a5 5 0 1 0 8-.005",
      },
    ],
  ],
};

/**
 * Creates the power-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PowerCircle(options) {
  return createIcon(definition, options);
}

export default PowerCircle;
