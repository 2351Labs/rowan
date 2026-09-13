import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-down-up",
  nodes: [
    [
      "path",
      {
        d: "m3 16 4 4 4-4",
      },
    ],
    [
      "path",
      {
        d: "M7 20V4",
      },
    ],
    [
      "path",
      {
        d: "m21 8-4-4-4 4",
      },
    ],
    [
      "path",
      {
        d: "M17 4v16",
      },
    ],
  ],
};

/**
 * Creates the arrow-down-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowDownUp(options) {
  return createIcon(definition, options);
}

export default ArrowDownUp;
