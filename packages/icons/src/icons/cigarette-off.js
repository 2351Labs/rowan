import { createIcon } from "../icon.js";

const definition = {
  name: "cigarette-off",
  nodes: [
    [
      "path",
      {
        d: "M12 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h13",
      },
    ],
    [
      "path",
      {
        d: "M18 8c0-2.5-2-2.5-2-5",
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
        d: "M21 12a1 1 0 0 1 1 1v2a1 1 0 0 1-.5.866",
      },
    ],
    [
      "path",
      {
        d: "M22 8c0-2.5-2-2.5-2-5",
      },
    ],
    [
      "path",
      {
        d: "M7 12v4",
      },
    ],
  ],
};

/**
 * Creates the cigarette-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CigaretteOff(options) {
  return createIcon(definition, options);
}

export default CigaretteOff;
