import { createIcon } from "../icon.js";

const definition = {
  name: "briefcase",
  nodes: [
    [
      "path",
      {
        d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
      },
    ],
    [
      "rect",
      {
        width: "20",
        height: "14",
        x: "2",
        y: "6",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the briefcase icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Briefcase(options) {
  return createIcon(definition, options);
}

export default Briefcase;
