import { createIcon } from "../icon.js";

const definition = {
  name: "utility-pole",
  nodes: [
    [
      "path",
      {
        d: "M12 2v20",
      },
    ],
    [
      "path",
      {
        d: "M2 5h20",
      },
    ],
    [
      "path",
      {
        d: "M3 3v2",
      },
    ],
    [
      "path",
      {
        d: "M7 3v2",
      },
    ],
    [
      "path",
      {
        d: "M17 3v2",
      },
    ],
    [
      "path",
      {
        d: "M21 3v2",
      },
    ],
    [
      "path",
      {
        d: "m19 5-7 7-7-7",
      },
    ],
  ],
};

/**
 * Creates the utility-pole icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UtilityPole(options) {
  return createIcon(definition, options);
}

export default UtilityPole;
