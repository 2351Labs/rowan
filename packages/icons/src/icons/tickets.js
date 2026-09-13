import { createIcon } from "../icon.js";

const definition = {
  name: "tickets",
  nodes: [
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
 * Creates the tickets icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Tickets(options) {
  return createIcon(definition, options);
}

export default Tickets;
