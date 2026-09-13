import { createIcon } from "../icon.js";

const definition = {
  name: "calendar-off",
  nodes: [
    [
      "path",
      {
        d: "M16 2v3",
      },
    ],
    [
      "path",
      {
        d: "m2 2 20 20",
      },
    ],
    [
      "path",
      {
        d: "M21 9h-5.5",
      },
    ],
    [
      "path",
      {
        d: "M3 9h6",
      },
    ],
    [
      "path",
      {
        d: "M3.586 3.586A2 2 0 003 5v14a2 2 0 002 2h14a2 2 0 001.414-.586",
      },
    ],
    [
      "path",
      {
        d: "M8.656 3H19a2 2 0 012 2v10.344",
      },
    ],
  ],
};

/**
 * Creates the calendar-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CalendarOff(options) {
  return createIcon(definition, options);
}

export default CalendarOff;
