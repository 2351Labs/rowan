import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-circle",
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
        d: "m16 12-4-4-4 4",
      },
    ],
    [
      "path",
      {
        d: "M12 16V8",
      },
    ],
  ],
};

/**
 * Creates the arrow-up-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpCircle(options) {
  return createIcon(definition, options);
}

export default ArrowUpCircle;
