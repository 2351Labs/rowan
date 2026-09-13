import { createIcon } from "../icon.js";

const definition = {
  name: "square-dashed-top-solid",
  nodes: [
    [
      "path",
      {
        d: "M14 21h1",
      },
    ],
    [
      "path",
      {
        d: "M21 14v1",
      },
    ],
    [
      "path",
      {
        d: "M21 19a2 2 0 0 1-2 2",
      },
    ],
    [
      "path",
      {
        d: "M21 9v1",
      },
    ],
    [
      "path",
      {
        d: "M3 14v1",
      },
    ],
    [
      "path",
      {
        d: "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2",
      },
    ],
    [
      "path",
      {
        d: "M3 9v1",
      },
    ],
    [
      "path",
      {
        d: "M5 21a2 2 0 0 1-2-2",
      },
    ],
    [
      "path",
      {
        d: "M9 21h1",
      },
    ],
  ],
};

/**
 * Creates the square-dashed-top-solid icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareDashedTopSolid(options) {
  return createIcon(definition, options);
}

export default SquareDashedTopSolid;
