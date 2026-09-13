import { createIcon } from "../icon.js";

const definition = {
  name: "superscript",
  nodes: [
    [
      "path",
      {
        d: "m4 19 8-8",
      },
    ],
    [
      "path",
      {
        d: "m12 19-8-8",
      },
    ],
    [
      "path",
      {
        d: "M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06",
      },
    ],
  ],
};

/**
 * Creates the superscript icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Superscript(options) {
  return createIcon(definition, options);
}

export default Superscript;
