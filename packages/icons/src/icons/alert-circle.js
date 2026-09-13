import { createIcon } from "../icon.js";

const definition = {
  name: "alert-circle",
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
      "line",
      {
        x1: "12",
        x2: "12",
        y1: "8",
        y2: "12",
      },
    ],
    [
      "line",
      {
        x1: "12",
        x2: "12.01",
        y1: "16",
        y2: "16",
      },
    ],
  ],
};

/**
 * Creates the alert-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlertCircle(options) {
  return createIcon(definition, options);
}

export default AlertCircle;
