import { createIcon } from "../icon.js";

const definition = {
  name: "check-circle-2",
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
        d: "m16 9-5.5 5.5L8 12",
      },
    ],
  ],
};

/**
 * Creates the check-circle-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CheckCircle2(options) {
  return createIcon(definition, options);
}

export default CheckCircle2;
