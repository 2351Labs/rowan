import { createIcon } from "../icon.js";

const definition = {
  name: "clock-5",
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
        d: "M12 6v6l2 4",
      },
    ],
  ],
};

/**
 * Creates the clock-5 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Clock5(options) {
  return createIcon(definition, options);
}

export default Clock5;
