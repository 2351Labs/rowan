import { createIcon } from "../icon.js";

const definition = {
  name: "alarm-check",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "13",
        r: "8",
      },
    ],
    [
      "path",
      {
        d: "M5 3 2 6",
      },
    ],
    [
      "path",
      {
        d: "m22 6-3-3",
      },
    ],
    [
      "path",
      {
        d: "M6.38 18.7 4 21",
      },
    ],
    [
      "path",
      {
        d: "M17.64 18.67 20 21",
      },
    ],
    [
      "path",
      {
        d: "m9 13 2 2 4-4",
      },
    ],
  ],
};

/**
 * Creates the alarm-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlarmCheck(options) {
  return createIcon(definition, options);
}

export default AlarmCheck;
