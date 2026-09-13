import { createIcon } from "../icon.js";

const definition = {
  name: "calendar-clock",
  nodes: [
    [
      "path",
      {
        d: "M16 14v2.2l1.6 1",
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
        d: "M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338",
      },
    ],
    [
      "path",
      {
        d: "M3 9h5.859",
      },
    ],
    [
      "path",
      {
        d: "M8 2v3",
      },
    ],
    [
      "circle",
      {
        cx: "16",
        cy: "16",
        r: "6",
      },
    ],
  ],
};

/**
 * Creates the calendar-clock icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CalendarClock(options) {
  return createIcon(definition, options);
}

export default CalendarClock;
