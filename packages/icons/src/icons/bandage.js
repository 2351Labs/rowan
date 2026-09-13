import { createIcon } from "../icon.js";

const definition = {
  name: "bandage",
  nodes: [
    [
      "path",
      {
        d: "M10 10.01h.01",
      },
    ],
    [
      "path",
      {
        d: "M10 14.01h.01",
      },
    ],
    [
      "path",
      {
        d: "M14 10.01h.01",
      },
    ],
    [
      "path",
      {
        d: "M14 14.01h.01",
      },
    ],
    [
      "path",
      {
        d: "M18 6v12",
      },
    ],
    [
      "path",
      {
        d: "M6 6v12",
      },
    ],
    [
      "rect",
      {
        x: "2",
        y: "6",
        width: "20",
        height: "12",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the bandage icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Bandage(options) {
  return createIcon(definition, options);
}

export default Bandage;
