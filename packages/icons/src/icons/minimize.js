import { createIcon } from "../icon.js";

const definition = {
  name: "minimize",
  nodes: [
    [
      "path",
      {
        d: "M8 3v3a2 2 0 0 1-2 2H3",
      },
    ],
    [
      "path",
      {
        d: "M21 8h-3a2 2 0 0 1-2-2V3",
      },
    ],
    [
      "path",
      {
        d: "M3 16h3a2 2 0 0 1 2 2v3",
      },
    ],
    [
      "path",
      {
        d: "M16 21v-3a2 2 0 0 1 2-2h3",
      },
    ],
  ],
};

/**
 * Creates the minimize icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Minimize(options) {
  return createIcon(definition, options);
}

export default Minimize;
