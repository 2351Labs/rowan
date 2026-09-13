import { createIcon } from "../icon.js";

const definition = {
  name: "antenna",
  nodes: [
    [
      "path",
      {
        d: "M2 12 7 2",
      },
    ],
    [
      "path",
      {
        d: "m7 12 5-10",
      },
    ],
    [
      "path",
      {
        d: "m12 12 5-10",
      },
    ],
    [
      "path",
      {
        d: "m17 12 5-10",
      },
    ],
    [
      "path",
      {
        d: "M4.5 7h15",
      },
    ],
    [
      "path",
      {
        d: "M12 16v6",
      },
    ],
  ],
};

/**
 * Creates the antenna icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Antenna(options) {
  return createIcon(definition, options);
}

export default Antenna;
