import { createIcon } from "../icon.js";

const definition = {
  name: "playing-card",
  nodes: [
    [
      "path",
      {
        d: "M12.832 8.445a1 1 0 00-1.589-.098l-2.075 3.098a1 1 0 000 1.11l2 3a1 1 0 001.664 0l2-3a1 1 0 000-1.11z",
      },
    ],
    [
      "rect",
      {
        x: "5",
        y: "2",
        width: "14",
        height: "20",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the playing-card icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PlayingCard(options) {
  return createIcon(definition, options);
}

export default PlayingCard;
