import { createIcon } from "../icon.js";

const definition = {
  name: "list-clock",
  nodes: [
    [
      "path",
      {
        d: "M16 13v2.2l1.6 1",
      },
    ],
    [
      "path",
      {
        d: "M3 12h3.458",
      },
    ],
    [
      "path",
      {
        d: "M3 19h3.832",
      },
    ],
    [
      "path",
      {
        d: "M3 5h18",
      },
    ],
    [
      "circle",
      {
        cx: "16",
        cy: "15",
        r: "6",
      },
    ],
  ],
};

/**
 * Creates the list-clock icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListClock(options) {
  return createIcon(definition, options);
}

export default ListClock;
