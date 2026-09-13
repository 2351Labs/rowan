import { createIcon } from "../icon.js";

const definition = {
  name: "dome",
  nodes: [
    [
      "path",
      {
        d: "M10 21v-3a2 2 0 014 0v3",
      },
    ],
    [
      "path",
      {
        d: "M12 2v2",
      },
    ],
    [
      "path",
      {
        d: "M18 12v9",
      },
    ],
    [
      "path",
      {
        d: "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2v-6a1 1 0 011-1h18a1 1 0 011 1z",
      },
    ],
    [
      "path",
      {
        d: "M4 12a8 8 0 0116 0",
      },
    ],
    [
      "path",
      {
        d: "M6 12v9",
      },
    ],
  ],
};

/**
 * Creates the dome icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Dome(options) {
  return createIcon(definition, options);
}

export default Dome;
