import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-down-left-from-circle",
  nodes: [
    [
      "path",
      {
        d: "M2 12a10 10 0 1 1 10 10",
      },
    ],
    [
      "path",
      {
        d: "m2 22 10-10",
      },
    ],
    [
      "path",
      {
        d: "M8 22H2v-6",
      },
    ],
  ],
};

/**
 * Creates the arrow-down-left-from-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowDownLeftFromCircle(options) {
  return createIcon(definition, options);
}

export default ArrowDownLeftFromCircle;
