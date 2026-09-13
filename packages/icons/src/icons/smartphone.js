import { createIcon } from "../icon.js";

const definition = {
  name: "smartphone",
  nodes: [
    [
      "rect",
      {
        width: "14",
        height: "20",
        x: "5",
        y: "2",
        rx: "2",
        ry: "2",
      },
    ],
    [
      "path",
      {
        d: "M12 18h.01",
      },
    ],
  ],
};

/**
 * Creates the smartphone icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Smartphone(options) {
  return createIcon(definition, options);
}

export default Smartphone;
