import { createIcon } from "../icon.js";

const definition = {
  name: "ban",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "M4.929 4.929 19.07 19.071",
      },
    ],
  ],
};

/**
 * Creates the ban icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Ban(options) {
  return createIcon(definition, options);
}

export default Ban;
