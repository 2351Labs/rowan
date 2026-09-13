import { createIcon } from "../icon.js";

const definition = {
  name: "film",
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
        d: "M7 3v18",
      },
    ],
    [
      "path",
      {
        d: "M3 7.5h4",
      },
    ],
    [
      "path",
      {
        d: "M3 12h18",
      },
    ],
    [
      "path",
      {
        d: "M3 16.5h4",
      },
    ],
    [
      "path",
      {
        d: "M17 3v18",
      },
    ],
    [
      "path",
      {
        d: "M17 7.5h4",
      },
    ],
    [
      "path",
      {
        d: "M17 16.5h4",
      },
    ],
  ],
};

/**
 * Creates the film icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Film(options) {
  return createIcon(definition, options);
}

export default Film;
