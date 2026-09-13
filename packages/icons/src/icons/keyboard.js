import { createIcon } from "../icon.js";

const definition = {
  name: "keyboard",
  nodes: [
    [
      "path",
      {
        d: "M10 8h.01",
      },
    ],
    [
      "path",
      {
        d: "M12 12h.01",
      },
    ],
    [
      "path",
      {
        d: "M14 8h.01",
      },
    ],
    [
      "path",
      {
        d: "M16 12h.01",
      },
    ],
    [
      "path",
      {
        d: "M18 8h.01",
      },
    ],
    [
      "path",
      {
        d: "M6 8h.01",
      },
    ],
    [
      "path",
      {
        d: "M7 16h10",
      },
    ],
    [
      "path",
      {
        d: "M8 12h.01",
      },
    ],
    [
      "rect",
      {
        width: "20",
        height: "16",
        x: "2",
        y: "4",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the keyboard icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Keyboard(options) {
  return createIcon(definition, options);
}

export default Keyboard;
