import { createIcon } from "../icon.js";

const definition = {
  name: "ellipsis-vertical",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "5",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "19",
        r: "1",
      },
    ],
  ],
};

/**
 * Creates the ellipsis-vertical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function EllipsisVertical(options) {
  return createIcon(definition, options);
}

export default EllipsisVertical;
