import { createIcon } from "../icon.js";

const definition = {
  name: "clock-1",
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
        d: "M12 6v6l2-4",
      },
    ],
  ],
};

/**
 * Creates the clock-1 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Clock1(options) {
  return createIcon(definition, options);
}

export default Clock1;
