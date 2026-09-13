import { createIcon } from "../icon.js";

const definition = {
  name: "outdent",
  nodes: [
    [
      "path",
      {
        d: "M21 5H11",
      },
    ],
    [
      "path",
      {
        d: "M21 12H11",
      },
    ],
    [
      "path",
      {
        d: "M21 19H11",
      },
    ],
    [
      "path",
      {
        d: "m7 8-4 4 4 4",
      },
    ],
  ],
};

/**
 * Creates the outdent icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Outdent(options) {
  return createIcon(definition, options);
}

export default Outdent;
