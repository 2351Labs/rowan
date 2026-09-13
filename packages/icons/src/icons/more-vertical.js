import { createIcon } from "../icon.js";

const definition = {
  name: "more-vertical",
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
 * Creates the more-vertical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MoreVertical(options) {
  return createIcon(definition, options);
}

export default MoreVertical;
