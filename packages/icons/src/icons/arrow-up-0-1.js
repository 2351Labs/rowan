import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-0-1",
  nodes: [
    [
      "path",
      {
        d: "m3 8 4-4 4 4",
      },
    ],
    [
      "path",
      {
        d: "M7 4v16",
      },
    ],
    [
      "rect",
      {
        x: "15",
        y: "4",
        width: "4",
        height: "6",
        ry: "2",
      },
    ],
    [
      "path",
      {
        d: "M17 20v-6h-2",
      },
    ],
    [
      "path",
      {
        d: "M15 20h4",
      },
    ],
  ],
};

/**
 * Creates the arrow-up-0-1 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUp0To1(options) {
  return createIcon(definition, options);
}

export default ArrowUp0To1;
