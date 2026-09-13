import { createIcon } from "../icon.js";

const definition = {
  name: "banknote-x",
  nodes: [
    [
      "path",
      {
        d: "M13 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5",
      },
    ],
    [
      "path",
      {
        d: "m17 17 5 5",
      },
    ],
    [
      "path",
      {
        d: "M18 12h.01",
      },
    ],
    [
      "path",
      {
        d: "m22 17-5 5",
      },
    ],
    [
      "path",
      {
        d: "M6 12h.01",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the banknote-x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BanknoteX(options) {
  return createIcon(definition, options);
}

export default BanknoteX;
