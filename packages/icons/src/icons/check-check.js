import { createIcon } from "../icon.js";

const definition = {
  name: "check-check",
  nodes: [
    [
      "path",
      {
        d: "M18 6 7 17l-5-5",
      },
    ],
    [
      "path",
      {
        d: "m22 10-7.5 7.5L13 16",
      },
    ],
  ],
};

/**
 * Creates the check-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CheckCheck(options) {
  return createIcon(definition, options);
}

export default CheckCheck;
