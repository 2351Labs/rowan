import { createIcon } from "../icon.js";

const definition = {
  name: "clock",
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
        d: "M12 6v6l4 2",
      },
    ],
  ],
};

/**
 * Creates the clock icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Clock(options) {
  return createIcon(definition, options);
}

export default Clock;
