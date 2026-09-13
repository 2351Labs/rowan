import { createIcon } from "../icon.js";

const definition = {
  name: "calendar",
  nodes: [
    [
      "path",
      {
        d: "M8 2v3",
      },
    ],
    [
      "path",
      {
        d: "M16 2v3",
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
    [
      "path",
      {
        d: "M3 9h18",
      },
    ],
  ],
};

/**
 * Creates the calendar icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Calendar(options) {
  return createIcon(definition, options);
}

export default Calendar;
