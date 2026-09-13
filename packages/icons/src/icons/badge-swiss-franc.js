import { createIcon } from "../icon.js";

const definition = {
  name: "badge-swiss-franc",
  nodes: [
    [
      "path",
      {
        d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
      },
    ],
    [
      "path",
      {
        d: "M11 17V8h4",
      },
    ],
    [
      "path",
      {
        d: "M11 12h3",
      },
    ],
    [
      "path",
      {
        d: "M9 16h4",
      },
    ],
  ],
};

/**
 * Creates the badge-swiss-franc icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BadgeSwissFranc(options) {
  return createIcon(definition, options);
}

export default BadgeSwissFranc;
