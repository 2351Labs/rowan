import { createIcon } from "../icon.js";

const definition = {
  name: "clock-6",
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
        d: "M12 6v10",
      },
    ],
  ],
};

/**
 * Creates the clock-6 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Clock6(options) {
  return createIcon(definition, options);
}

export default Clock6;
