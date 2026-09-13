import { createIcon } from "../icon.js";

const definition = {
  name: "thermometer-sun",
  nodes: [
    [
      "path",
      {
        d: "M12 2v2",
      },
    ],
    [
      "path",
      {
        d: "M12 8a4 4 0 0 0-1.645 7.647",
      },
    ],
    [
      "path",
      {
        d: "M2 12h2",
      },
    ],
    [
      "path",
      {
        d: "M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z",
      },
    ],
    [
      "path",
      {
        d: "m4.93 4.93 1.41 1.41",
      },
    ],
    [
      "path",
      {
        d: "m6.34 17.66-1.41 1.41",
      },
    ],
  ],
};

/**
 * Creates the thermometer-sun icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ThermometerSun(options) {
  return createIcon(definition, options);
}

export default ThermometerSun;
