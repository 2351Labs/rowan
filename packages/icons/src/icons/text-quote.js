import { createIcon } from "../icon.js";

const definition = {
  name: "text-quote",
  nodes: [
    [
      "path",
      {
        d: "M17 5H3",
      },
    ],
    [
      "path",
      {
        d: "M21 12H8",
      },
    ],
    [
      "path",
      {
        d: "M21 19H8",
      },
    ],
    [
      "path",
      {
        d: "M3 12v7",
      },
    ],
  ],
};

/**
 * Creates the text-quote icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TextQuote(options) {
  return createIcon(definition, options);
}

export default TextQuote;
