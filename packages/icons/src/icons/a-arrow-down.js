import { createIcon } from "../icon.js";

const definition = {
  name: "a-arrow-down",
  nodes: [
    [
      "path",
      {
        d: "m14 12 4 4 4-4",
      },
    ],
    [
      "path",
      {
        d: "M18 16V7",
      },
    ],
    [
      "path",
      {
        d: "m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16",
      },
    ],
    [
      "path",
      {
        d: "M3.304 13h6.392",
      },
    ],
  ],
};

/**
 * Creates the a-arrow-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AArrowDown(options) {
  return createIcon(definition, options);
}

export default AArrowDown;
