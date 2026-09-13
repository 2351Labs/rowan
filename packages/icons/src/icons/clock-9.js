import { createIcon } from "../icon.js";

const definition = {
  name: "clock-9",
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
        d: "M12 6v6H8",
      },
    ],
  ],
};

/**
 * Creates the clock-9 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Clock9(options) {
  return createIcon(definition, options);
}

export default Clock9;
