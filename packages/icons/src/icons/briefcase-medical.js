import { createIcon } from "../icon.js";

const definition = {
  name: "briefcase-medical",
  nodes: [
    [
      "path",
      {
        d: "M12 11v4",
      },
    ],
    [
      "path",
      {
        d: "M14 13h-4",
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
        d: "M18 6v14",
      },
    ],
    [
      "path",
      {
        d: "M6 6v14",
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
 * Creates the briefcase-medical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BriefcaseMedical(options) {
  return createIcon(definition, options);
}

export default BriefcaseMedical;
