import { createIcon } from "../icon.js";

const definition = {
  name: "washing-machine",
  nodes: [
    [
      "path",
      {
        d: "M3 6h3",
      },
    ],
    [
      "path",
      {
        d: "M17 6h.01",
      },
    ],
    [
      "rect",
      {
        width: "18",
        height: "20",
        x: "3",
        y: "2",
        rx: "2",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "13",
        r: "5",
      },
    ],
    [
      "path",
      {
        d: "M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5",
      },
    ],
  ],
};

/**
 * Creates the washing-machine icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function WashingMachine(options) {
  return createIcon(definition, options);
}

export default WashingMachine;
