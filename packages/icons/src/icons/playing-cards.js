import { createIcon } from "../icon.js";

const definition = {
  name: "playing-cards",
  nodes: [
    [
      "path",
      {
        d: "M14.832 8.445a1 1 0 00-1.589-.098l-2.075 3.098a1 1 0 000 1.11l2 3a1 1 0 001.664 0l2-3a1 1 0 000-1.11z",
      },
    ],
    [
      "path",
      {
        d: "m7.18 20.827-5-11a2 2 0 01.993-2.647L7 5.44",
      },
    ],
    [
      "rect",
      {
        x: "7",
        y: "2",
        width: "14",
        height: "20",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the playing-cards icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PlayingCards(options) {
  return createIcon(definition, options);
}

export default PlayingCards;
