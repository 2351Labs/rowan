import { createIcon } from "../icon.js";

const definition = {
  name: "clock-12",
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
        d: "M12 6v6",
      },
    ],
  ],
};

/**
 * Creates the clock-12 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Clock12(options) {
  return createIcon(definition, options);
}

export default Clock12;
