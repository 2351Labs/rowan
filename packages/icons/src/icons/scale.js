import { createIcon } from "../icon.js";

const definition = {
  name: "scale",
  nodes: [
    [
      "path",
      {
        d: "M12 3v18",
      },
    ],
    [
      "path",
      {
        d: "m19 8 3 8a5 5 0 0 1-6 0zV7",
      },
    ],
    [
      "path",
      {
        d: "M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1",
      },
    ],
    [
      "path",
      {
        d: "m5 8 3 8a5 5 0 0 1-6 0zV7",
      },
    ],
    [
      "path",
      {
        d: "M7 21h10",
      },
    ],
  ],
};

/**
 * Creates the scale icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Scale(options) {
  return createIcon(definition, options);
}

export default Scale;
