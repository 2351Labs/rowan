import { createIcon } from "../icon.js";

const definition = {
  name: "separator-vertical",
  nodes: [
    [
      "path",
      {
        d: "M12 3v18",
      },
    ],
    [
      "path",
      {
        d: "m16 16 4-4-4-4",
      },
    ],
    [
      "path",
      {
        d: "m8 8-4 4 4 4",
      },
    ],
  ],
};

/**
 * Creates the separator-vertical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SeparatorVertical(options) {
  return createIcon(definition, options);
}

export default SeparatorVertical;
