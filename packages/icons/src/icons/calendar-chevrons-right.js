import { createIcon } from "../icon.js";

const definition = {
  name: "calendar-chevrons-right",
  nodes: [
    [
      "path",
      {
        d: "m13 21 3-3-3-3",
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
        d: "m19 21 3-3-3-3",
      },
    ],
    [
      "path",
      {
        d: "M21 11.5V5.05a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2L9 21",
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
 * Creates the calendar-chevrons-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CalendarChevronsRight(options) {
  return createIcon(definition, options);
}

export default CalendarChevronsRight;
