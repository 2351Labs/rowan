import { createIcon } from "../icon.js";

const definition = {
  name: "locate-off",
  nodes: [
    [
      "path",
      {
        d: "M12 19v3",
      },
    ],
    [
      "path",
      {
        d: "M12 2v3",
      },
    ],
    [
      "path",
      {
        d: "M18.89 13.24a7 7 0 0 0-8.13-8.13",
      },
    ],
    [
      "path",
      {
        d: "M19 12h3",
      },
    ],
    [
      "path",
      {
        d: "M2 12h3",
      },
    ],
    [
      "path",
      {
        d: "m2 2 20 20",
      },
    ],
    [
      "path",
      {
        d: "M7.05 7.05a7 7 0 0 0 9.9 9.9",
      },
    ],
  ],
};

/**
 * Creates the locate-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LocateOff(options) {
  return createIcon(definition, options);
}

export default LocateOff;
