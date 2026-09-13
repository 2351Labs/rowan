import { createIcon } from "../icon.js";

const definition = {
  name: "ampersand",
  nodes: [
    [
      "path",
      {
        d: "M16 12h3",
      },
    ],
    [
      "path",
      {
        d: "M17.5 12a8 8 0 0 1-8 8A4.5 4.5 0 0 1 5 15.5c0-6 8-4 8-8.5a3 3 0 1 0-6 0c0 3 2.5 8.5 12 13",
      },
    ],
  ],
};

/**
 * Creates the ampersand icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Ampersand(options) {
  return createIcon(definition, options);
}

export default Ampersand;
