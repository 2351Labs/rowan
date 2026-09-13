import { createIcon } from "../icon.js";

const definition = {
  name: "check-circle",
  nodes: [
    [
      "path",
      {
        d: "M21.801 10A10 10 0 1 1 17 3.335",
      },
    ],
    [
      "path",
      {
        d: "m9 11 3 3L22 4",
      },
    ],
  ],
};

/**
 * Creates the check-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CheckCircle(options) {
  return createIcon(definition, options);
}

export default CheckCircle;
