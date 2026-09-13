import { createIcon } from "../icon.js";

const definition = {
  name: "birdhouse",
  nodes: [
    [
      "path",
      {
        d: "M12 18v4",
      },
    ],
    [
      "path",
      {
        d: "m17 18 1.956-11.468",
      },
    ],
    [
      "path",
      {
        d: "m3 8 7.82-5.615a2 2 0 0 1 2.36 0L21 8",
      },
    ],
    [
      "path",
      {
        d: "M4 18h16",
      },
    ],
    [
      "path",
      {
        d: "M7 18 5.044 6.532",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "10",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the birdhouse icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Birdhouse(options) {
  return createIcon(definition, options);
}

export default Birdhouse;
