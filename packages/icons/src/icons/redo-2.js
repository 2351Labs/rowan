import { createIcon } from "../icon.js";

const definition = {
  name: "redo-2",
  nodes: [
    [
      "path",
      {
        d: "m15 14 5-5-5-5",
      },
    ],
    [
      "path",
      {
        d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
      },
    ],
  ],
};

/**
 * Creates the redo-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Redo2(options) {
  return createIcon(definition, options);
}

export default Redo2;
