import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-down-to-dot",
  nodes: [
    [
      "path",
      {
        d: "M12 2v14",
      },
    ],
    [
      "path",
      {
        d: "m19 9-7 7-7-7",
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
 * Creates the arrow-down-to-dot icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowDownToDot(options) {
  return createIcon(definition, options);
}

export default ArrowDownToDot;
