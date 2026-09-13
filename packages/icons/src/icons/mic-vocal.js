import { createIcon } from "../icon.js";

const definition = {
  name: "mic-vocal",
  nodes: [
    [
      "path",
      {
        d: "m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12",
      },
    ],
    [
      "path",
      {
        d: "M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5",
      },
    ],
    [
      "circle",
      {
        cx: "16",
        cy: "7",
        r: "5",
      },
    ],
  ],
};

/**
 * Creates the mic-vocal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MicVocal(options) {
  return createIcon(definition, options);
}

export default MicVocal;
