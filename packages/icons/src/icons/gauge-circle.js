import { createIcon } from "../icon.js";

const definition = {
  name: "gauge-circle",
  nodes: [
    [
      "path",
      {
        d: "M15.6 2.7a10 10 0 1 0 5.7 5.7",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "2",
      },
    ],
    [
      "path",
      {
        d: "M13.4 10.6 19 5",
      },
    ],
  ],
};

/**
 * Creates the gauge-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GaugeCircle(options) {
  return createIcon(definition, options);
}

export default GaugeCircle;
