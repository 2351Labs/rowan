import { createIcon } from "../icon.js";

const definition = {
  name: "clock-10",
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
        d: "M12 6v6l-4-2",
      },
    ],
  ],
};

/**
 * Creates the clock-10 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Clock10(options) {
  return createIcon(definition, options);
}

export default Clock10;
