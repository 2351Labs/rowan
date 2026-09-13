import { createIcon } from "../icon.js";

const definition = {
  name: "computer",
  nodes: [
    [
      "path",
      {
        d: "M12 18h6",
      },
    ],
    [
      "path",
      {
        d: "M6 18h.01",
      },
    ],
    [
      "path",
      {
        d: "M8 6h1",
      },
    ],
    [
      "rect",
      {
        x: "2",
        y: "14",
        width: "20",
        height: "8",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        x: "4",
        y: "2",
        width: "16",
        height: "12",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the computer icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Computer(options) {
  return createIcon(definition, options);
}

export default Computer;
