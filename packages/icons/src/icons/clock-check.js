import { createIcon } from "../icon.js";

const definition = {
  name: "clock-check",
  nodes: [
    [
      "path",
      {
        d: "M21.95 13a10 10 0 1 0-8.685 8.92",
      },
    ],
    [
      "path",
      {
        d: "M12 6v6l4 2",
      },
    ],
    [
      "path",
      {
        d: "m16 19 2 2 4-4",
      },
    ],
  ],
};

/**
 * Creates the clock-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ClockCheck(options) {
  return createIcon(definition, options);
}

export default ClockCheck;
