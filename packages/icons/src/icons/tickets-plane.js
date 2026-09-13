import { createIcon } from "../icon.js";

const definition = {
  name: "tickets-plane",
  nodes: [
    [
      "path",
      {
        d: "M10.5 17h1.227a2 2 0 0 0 1.345-.52L18 12",
      },
    ],
    [
      "path",
      {
        d: "m12 13.5 3.794.506",
      },
    ],
    [
      "path",
      {
        d: "m3.173 8.18 11-5a2 2 0 0 1 2.647.993L18.56 8",
      },
    ],
    [
      "path",
      {
        d: "M6 10V8",
      },
    ],
    [
      "path",
      {
        d: "M6 14v1",
      },
    ],
    [
      "path",
      {
        d: "M6 19v2",
      },
    ],
    [
      "rect",
      {
        x: "2",
        y: "8",
        width: "20",
        height: "13",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the tickets-plane icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TicketsPlane(options) {
  return createIcon(definition, options);
}

export default TicketsPlane;
