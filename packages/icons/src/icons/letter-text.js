import { createIcon } from "../icon.js";

const definition = {
  name: "letter-text",
  nodes: [
    [
      "path",
      {
        d: "M15 5h6",
      },
    ],
    [
      "path",
      {
        d: "M15 12h6",
      },
    ],
    [
      "path",
      {
        d: "M3 19h18",
      },
    ],
    [
      "path",
      {
        d: "m3 12 3.553-7.724a.5.5 0 0 1 .894 0L11 12",
      },
    ],
    [
      "path",
      {
        d: "M3.92 10h6.16",
      },
    ],
  ],
};

/**
 * Creates the letter-text icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LetterText(options) {
  return createIcon(definition, options);
}

export default LetterText;
