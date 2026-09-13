import { createIcon } from "../icon.js";

const definition = {
  name: "calendar-1",
  nodes: [
    [
      "path",
      {
        d: "M11 13h1v4",
      },
    ],
    [
      "path",
      {
        d: "M16 2v3",
      },
    ],
    [
      "path",
      {
        d: "M3 9h18",
      },
    ],
    [
      "path",
      {
        d: "M8 2v3",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the calendar-1 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Calendar1(options) {
  return createIcon(definition, options);
}

export default Calendar1;
