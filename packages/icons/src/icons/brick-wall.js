import { createIcon } from "../icon.js";

const definition = {
  name: "brick-wall",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M12 9v6",
      },
    ],
    [
      "path",
      {
        d: "M16 15v6",
      },
    ],
    [
      "path",
      {
        d: "M16 3v6",
      },
    ],
    [
      "path",
      {
        d: "M3 15h18",
      },
    ],
    [
      "path",
      {
        d: "M3 9h18",
      },
    ],
    [
      "path",
      {
        d: "M8 15v6",
      },
    ],
    [
      "path",
      {
        d: "M8 3v6",
      },
    ],
  ],
};

/**
 * Creates the brick-wall icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BrickWall(options) {
  return createIcon(definition, options);
}

export default BrickWall;
