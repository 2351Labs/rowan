import { createIcon } from "../icon.js";

const definition = {
  name: "align-horizontal-justify-center",
  nodes: [
    [
      "rect",
      {
        width: "6",
        height: "14",
        x: "2",
        y: "5",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "6",
        height: "10",
        x: "16",
        y: "7",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M12 2v20",
      },
    ],
  ],
};

/**
 * Creates the align-horizontal-justify-center icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignHorizontalJustifyCenter(options) {
  return createIcon(definition, options);
}

export default AlignHorizontalJustifyCenter;
