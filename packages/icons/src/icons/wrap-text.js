import { createIcon } from "../icon.js";

const definition = {
  name: "wrap-text",
  nodes: [
    [
      "path",
      {
        d: "m16 16-3 3 3 3",
      },
    ],
    [
      "path",
      {
        d: "M3 12h14.5a1 1 0 0 1 0 7H13",
      },
    ],
    [
      "path",
      {
        d: "M3 19h6",
      },
    ],
    [
      "path",
      {
        d: "M3 5h18",
      },
    ],
  ],
};

/**
 * Creates the wrap-text icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function WrapText(options) {
  return createIcon(definition, options);
}

export default WrapText;
