import { createIcon } from "../icon.js";

const definition = {
  name: "japanese-yen",
  nodes: [
    [
      "path",
      {
        d: "M12 9.5V21m0-11.5L6 3m6 6.5L18 3",
      },
    ],
    [
      "path",
      {
        d: "M6 15h12",
      },
    ],
    [
      "path",
      {
        d: "M6 11h12",
      },
    ],
  ],
};

/**
 * Creates the japanese-yen icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function JapaneseYen(options) {
  return createIcon(definition, options);
}

export default JapaneseYen;
