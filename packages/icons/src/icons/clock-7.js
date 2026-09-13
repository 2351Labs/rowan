import { createIcon } from "../icon.js";

const definition = {
  name: "clock-7",
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
        d: "M12 6v6l-2 4",
      },
    ],
  ],
};

/**
 * Creates the clock-7 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Clock7(options) {
  return createIcon(definition, options);
}

export default Clock7;
