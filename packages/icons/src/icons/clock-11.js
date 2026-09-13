import { createIcon } from "../icon.js";

const definition = {
  name: "clock-11",
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
        d: "M12 6v6l-2-4",
      },
    ],
  ],
};

/**
 * Creates the clock-11 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Clock11(options) {
  return createIcon(definition, options);
}

export default Clock11;
