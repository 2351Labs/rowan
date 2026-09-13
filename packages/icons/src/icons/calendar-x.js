import { createIcon } from "../icon.js";

const definition = {
  name: "calendar-x",
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
    [
      "path",
      {
        d: "m14 13-4 4",
      },
    ],
    [
      "path",
      {
        d: "m10 13 4 4",
      },
    ],
  ],
};

/**
 * Creates the calendar-x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CalendarX(options) {
  return createIcon(definition, options);
}

export default CalendarX;
