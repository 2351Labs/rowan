import { createIcon } from "../icon.js";

const definition = {
  name: "bot",
  nodes: [
    [
      "path",
      {
        d: "M12 8V4H8",
      },
    ],
    [
      "rect",
      {
        width: "16",
        height: "12",
        x: "4",
        y: "8",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M2 14h2",
      },
    ],
    [
      "path",
      {
        d: "M20 14h2",
      },
    ],
    [
      "path",
      {
        d: "M15 13v2",
      },
    ],
    [
      "path",
      {
        d: "M9 13v2",
      },
    ],
  ],
};

/**
 * Creates the bot icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Bot(options) {
  return createIcon(definition, options);
}

export default Bot;
