import { createIcon } from "../icon.js";

const definition = {
  name: "alarm-plus",
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
        d: "M12 10v6",
      },
    ],
    [
      "path",
      {
        d: "M9 13h6",
      },
    ],
  ],
};

/**
 * Creates the alarm-plus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlarmPlus(options) {
  return createIcon(definition, options);
}

export default AlarmPlus;
