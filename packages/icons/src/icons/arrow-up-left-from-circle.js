import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-left-from-circle",
  nodes: [
    [
      "path",
      {
        d: "M2 8V2h6",
      },
    ],
    [
      "path",
      {
        d: "m2 2 10 10",
      },
    ],
    [
      "path",
      {
        d: "M12 2A10 10 0 1 1 2 12",
      },
    ],
  ],
};

/**
 * Creates the arrow-up-left-from-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpLeftFromCircle(options) {
  return createIcon(definition, options);
}

export default ArrowUpLeftFromCircle;
