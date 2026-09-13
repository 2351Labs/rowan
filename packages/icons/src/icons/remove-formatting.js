import { createIcon } from "../icon.js";

const definition = {
  name: "remove-formatting",
  nodes: [
    [
      "path",
      {
        d: "M4 7V4h16v3",
      },
    ],
    [
      "path",
      {
        d: "M5 20h6",
      },
    ],
    [
      "path",
      {
        d: "M13 4 8 20",
      },
    ],
    [
      "path",
      {
        d: "m15 15 5 5",
      },
    ],
    [
      "path",
      {
        d: "m20 15-5 5",
      },
    ],
  ],
};

/**
 * Creates the remove-formatting icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function RemoveFormatting(options) {
  return createIcon(definition, options);
}

export default RemoveFormatting;
