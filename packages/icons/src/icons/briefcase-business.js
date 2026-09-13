import { createIcon } from "../icon.js";

const definition = {
  name: "briefcase-business",
  nodes: [
    [
      "path",
      {
        d: "M12 12h.01",
      },
    ],
    [
      "path",
      {
        d: "M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
      },
    ],
    [
      "path",
      {
        d: "M22 13a18.15 18.15 0 0 1-20 0",
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
 * Creates the briefcase-business icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BriefcaseBusiness(options) {
  return createIcon(definition, options);
}

export default BriefcaseBusiness;
