import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-right-from-circle",
  nodes: [
    [
      "path",
      {
        d: "M22 12A10 10 0 1 1 12 2",
      },
    ],
    [
      "path",
      {
        d: "M22 2 12 12",
      },
    ],
    [
      "path",
      {
        d: "M16 2h6v6",
      },
    ],
  ],
};

/**
 * Creates the arrow-up-right-from-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpRightFromCircle(options) {
  return createIcon(definition, options);
}

export default ArrowUpRightFromCircle;
