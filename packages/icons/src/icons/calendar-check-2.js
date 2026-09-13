import { createIcon } from "../icon.js";

const definition = {
  name: "calendar-check-2",
  nodes: [
    [
      "path",
      {
        d: "M 19 3 L 5 3",
      },
    ],
    [
      "path",
      {
        d: "M 21 13 L 21 5",
      },
    ],
    [
      "path",
      {
        d: "M 21 5 A2 2 0 0 0 19 3",
      },
    ],
    [
      "path",
      {
        d: "M 3 19 A2 2 0 0 0 5 21",
      },
    ],
    [
      "path",
      {
        d: "M 3 5 L 3 19",
      },
    ],
    [
      "path",
      {
        d: "M 5 3 A2 2 0 0 0 3 5",
      },
    ],
    [
      "path",
      {
        d: "m16 19 2 2 4-4",
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
        d: "M5 21 L12.5 21",
      },
    ],
    [
      "path",
      {
        d: "M8 2v3",
      },
    ],
  ],
};

/**
 * Creates the calendar-check-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CalendarCheck2(options) {
  return createIcon(definition, options);
}

export default CalendarCheck2;
