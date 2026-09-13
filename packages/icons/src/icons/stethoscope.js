import { createIcon } from "../icon.js";

const definition = {
  name: "stethoscope",
  nodes: [
    [
      "path",
      {
        d: "M11 2v2",
      },
    ],
    [
      "path",
      {
        d: "M5 2v2",
      },
    ],
    [
      "path",
      {
        d: "M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1",
      },
    ],
    [
      "path",
      {
        d: "M8 15a6 6 0 0 0 12 0v-3",
      },
    ],
    [
      "circle",
      {
        cx: "20",
        cy: "10",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the stethoscope icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Stethoscope(options) {
  return createIcon(definition, options);
}

export default Stethoscope;
