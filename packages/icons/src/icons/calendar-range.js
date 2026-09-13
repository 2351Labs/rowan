import { createIcon } from "../icon.js";

const definition = {
  name: "calendar-range",
  nodes: [
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
      "path",
      {
        d: "M17 13h-6",
      },
    ],
    [
      "path",
      {
        d: "M13 17H7",
      },
    ],
    [
      "path",
      {
        d: "M7 13h.01",
      },
    ],
    [
      "path",
      {
        d: "M17 17h.01",
      },
    ],
  ],
};

/**
 * Creates the calendar-range icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CalendarRange(options) {
  return createIcon(definition, options);
}

export default CalendarRange;
