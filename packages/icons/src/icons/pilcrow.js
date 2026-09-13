import { createIcon } from "../icon.js";

const definition = {
  name: "pilcrow",
  nodes: [
    [
      "path",
      {
        d: "M13 4v16",
      },
    ],
    [
      "path",
      {
        d: "M17 4v16",
      },
    ],
    [
      "path",
      {
        d: "M19 4H9.5a4.5 4.5 0 0 0 0 9H13",
      },
    ],
  ],
};

/**
 * Creates the pilcrow icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Pilcrow(options) {
  return createIcon(definition, options);
}

export default Pilcrow;
