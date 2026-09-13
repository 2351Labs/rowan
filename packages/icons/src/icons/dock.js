import { createIcon } from "../icon.js";

const definition = {
  name: "dock",
  nodes: [
    [
      "path",
      {
        d: "M2 8h20",
      },
    ],
    [
      "rect",
      {
        width: "20",
        height: "16",
        x: "2",
        y: "4",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M6 16h12",
      },
    ],
  ],
};

/**
 * Creates the dock icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Dock(options) {
  return createIcon(definition, options);
}

export default Dock;
