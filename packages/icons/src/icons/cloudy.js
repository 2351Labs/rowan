import { createIcon } from "../icon.js";

const definition = {
  name: "cloudy",
  nodes: [
    [
      "path",
      {
        d: "M17.5 12a1 1 0 1 1 0 9H9.006a7 7 0 1 1 6.702-9z",
      },
    ],
    [
      "path",
      {
        d: "M21.832 9A3 3 0 0 0 19 7h-2.207a5.5 5.5 0 0 0-10.72.61",
      },
    ],
  ],
};

/**
 * Creates the cloudy icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Cloudy(options) {
  return createIcon(definition, options);
}

export default Cloudy;
