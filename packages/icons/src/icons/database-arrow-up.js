import { createIcon } from "../icon.js";

const definition = {
  name: "database-arrow-up",
  nodes: [
    [
      "path",
      {
        d: "M19 22v-6",
      },
    ],
    [
      "path",
      {
        d: "M21 12.536V5",
      },
    ],
    [
      "path",
      {
        d: "m22 19-3-3-3 3",
      },
    ],
    [
      "path",
      {
        d: "M3 12A9 3 0 0 0 14.457 14.886",
      },
    ],
    [
      "path",
      {
        d: "M3 5V19A9 3 0 0 0 13.318 21.968",
      },
    ],
    [
      "ellipse",
      {
        cx: "12",
        cy: "5",
        rx: "9",
        ry: "3",
      },
    ],
  ],
};

/**
 * Creates the database-arrow-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function DatabaseArrowUp(options) {
  return createIcon(definition, options);
}

export default DatabaseArrowUp;
