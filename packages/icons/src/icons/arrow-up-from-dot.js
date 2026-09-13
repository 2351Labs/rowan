import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-from-dot",
  nodes: [
    [
      "path",
      {
        d: "m5 9 7-7 7 7",
      },
    ],
    [
      "path",
      {
        d: "M12 16V2",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "21",
        r: "1",
      },
    ],
  ],
};

/**
 * Creates the arrow-up-from-dot icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpFromDot(options) {
  return createIcon(definition, options);
}

export default ArrowUpFromDot;
