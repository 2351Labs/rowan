import { createIcon } from "../icon.js";

const definition = {
  name: "gauge",
  nodes: [
    [
      "path",
      {
        d: "m12 14 4-4",
      },
    ],
    [
      "path",
      {
        d: "M3.34 19a10 10 0 1 1 17.32 0",
      },
    ],
  ],
};

/**
 * Creates the gauge icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Gauge(options) {
  return createIcon(definition, options);
}

export default Gauge;
