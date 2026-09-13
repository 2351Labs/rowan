import { createIcon } from "../icon.js";

const definition = {
  name: "stretch-vertical",
  nodes: [
    [
      "rect",
      {
        width: "6",
        height: "20",
        x: "4",
        y: "2",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "6",
        height: "20",
        x: "14",
        y: "2",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the stretch-vertical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function StretchVertical(options) {
  return createIcon(definition, options);
}

export default StretchVertical;
