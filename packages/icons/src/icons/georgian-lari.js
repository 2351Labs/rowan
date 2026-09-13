import { createIcon } from "../icon.js";

const definition = {
  name: "georgian-lari",
  nodes: [
    [
      "path",
      {
        d: "M11.5 21a7.5 7.5 0 1 1 7.35-9",
      },
    ],
    [
      "path",
      {
        d: "M13 12V3",
      },
    ],
    [
      "path",
      {
        d: "M4 21h16",
      },
    ],
    [
      "path",
      {
        d: "M9 12V3",
      },
    ],
  ],
};

/**
 * Creates the georgian-lari icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GeorgianLari(options) {
  return createIcon(definition, options);
}

export default GeorgianLari;
