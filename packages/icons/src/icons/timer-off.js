import { createIcon } from "../icon.js";

const definition = {
  name: "timer-off",
  nodes: [
    [
      "path",
      {
        d: "M10 2h4",
      },
    ],
    [
      "path",
      {
        d: "M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7",
      },
    ],
    [
      "path",
      {
        d: "M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2",
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
        d: "M12 12v-2",
      },
    ],
  ],
};

/**
 * Creates the timer-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TimerOff(options) {
  return createIcon(definition, options);
}

export default TimerOff;
