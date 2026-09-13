import { createIcon } from "../icon.js";

const definition = {
  name: "a-arrow-up",
  nodes: [
    [
      "path",
      {
        d: "m14 11 4-4 4 4",
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
 * Creates the a-arrow-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AArrowUp(options) {
  return createIcon(definition, options);
}

export default AArrowUp;
