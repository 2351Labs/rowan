import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-down-circle",
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
        d: "M12 8v8",
      },
    ],
    [
      "path",
      {
        d: "m8 12 4 4 4-4",
      },
    ],
  ],
};

/**
 * Creates the arrow-down-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowDownCircle(options) {
  return createIcon(definition, options);
}

export default ArrowDownCircle;
