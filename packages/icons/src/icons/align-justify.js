import { createIcon } from "../icon.js";

const definition = {
  name: "align-justify",
  nodes: [
    [
      "path",
      {
        d: "M3 5h18",
      },
    ],
    [
      "path",
      {
        d: "M3 12h18",
      },
    ],
    [
      "path",
      {
        d: "M3 19h18",
      },
    ],
  ],
};

/**
 * Creates the align-justify icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignJustify(options) {
  return createIcon(definition, options);
}

export default AlignJustify;
