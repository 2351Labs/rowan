import { createIcon } from "../icon.js";

const definition = {
  name: "wind-arrow-down",
  nodes: [
    [
      "path",
      {
        d: "M10 2v8",
      },
    ],
    [
      "path",
      {
        d: "M12.8 21.6A2 2 0 1 0 14 18H2",
      },
    ],
    [
      "path",
      {
        d: "M17.5 10a2.5 2.5 0 1 1 2 4H2",
      },
    ],
    [
      "path",
      {
        d: "m6 6 4 4 4-4",
      },
    ],
  ],
};

/**
 * Creates the wind-arrow-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function WindArrowDown(options) {
  return createIcon(definition, options);
}

export default WindArrowDown;
