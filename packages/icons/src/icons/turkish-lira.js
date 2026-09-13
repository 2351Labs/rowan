import { createIcon } from "../icon.js";

const definition = {
  name: "turkish-lira",
  nodes: [
    [
      "path",
      {
        d: "M15 4 5 9",
      },
    ],
    [
      "path",
      {
        d: "m15 8.5-10 5",
      },
    ],
    [
      "path",
      {
        d: "M18 12a9 9 0 0 1-9 9V3",
      },
    ],
  ],
};

/**
 * Creates the turkish-lira icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TurkishLira(options) {
  return createIcon(definition, options);
}

export default TurkishLira;
