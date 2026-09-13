import { createIcon } from "../icon.js";

const definition = {
  name: "square-centerline-dashed-horizontal",
  nodes: [
    [
      "path",
      {
        d: "M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3",
      },
    ],
    [
      "path",
      {
        d: "M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3",
      },
    ],
    [
      "path",
      {
        d: "M12 20v2",
      },
    ],
    [
      "path",
      {
        d: "M12 14v2",
      },
    ],
    [
      "path",
      {
        d: "M12 8v2",
      },
    ],
    [
      "path",
      {
        d: "M12 2v2",
      },
    ],
  ],
};

/**
 * Creates the square-centerline-dashed-horizontal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareCenterlineDashedHorizontal(options) {
  return createIcon(definition, options);
}

export default SquareCenterlineDashedHorizontal;
