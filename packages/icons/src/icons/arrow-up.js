import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up",
  nodes: [
    [
      "path",
      {
        d: "m5 12 7-7 7 7",
      },
    ],
    [
      "path",
      {
        d: "M12 19V5",
      },
    ],
  ],
};

/**
 * Creates the arrow-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUp(options) {
  return createIcon(definition, options);
}

export default ArrowUp;
