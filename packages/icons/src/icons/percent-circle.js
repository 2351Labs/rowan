import { createIcon } from "../icon.js";

const definition = {
  name: "percent-circle",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "m15 9-6 6",
      },
    ],
    [
      "path",
      {
        d: "M9 9h.01",
      },
    ],
    [
      "path",
      {
        d: "M15 15h.01",
      },
    ],
  ],
};

/**
 * Creates the percent-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PercentCircle(options) {
  return createIcon(definition, options);
}

export default PercentCircle;
