import { createIcon } from "../icon.js";

const definition = {
  name: "banknote-arrow-down",
  nodes: [
    [
      "path",
      {
        d: "M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5",
      },
    ],
    [
      "path",
      {
        d: "m16 19 3 3 3-3",
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
        d: "M19 16v6",
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
 * Creates the banknote-arrow-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BanknoteArrowDown(options) {
  return createIcon(definition, options);
}

export default BanknoteArrowDown;
