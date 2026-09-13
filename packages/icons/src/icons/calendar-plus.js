import { createIcon } from "../icon.js";

const definition = {
  name: "calendar-plus",
  nodes: [
    [
      "path",
      {
        d: "M16 18h6",
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
        d: "M19 15v6",
      },
    ],
    [
      "path",
      {
        d: "M21 11.5V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h8.3",
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
  ],
};

/**
 * Creates the calendar-plus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CalendarPlus(options) {
  return createIcon(definition, options);
}

export default CalendarPlus;
