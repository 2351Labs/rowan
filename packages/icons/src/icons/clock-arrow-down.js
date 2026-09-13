import { createIcon } from "../icon.js";

const definition = {
  name: "clock-arrow-down",
  nodes: [
    [
      "path",
      {
        d: "M12 6v6l2 1",
      },
    ],
    [
      "path",
      {
        d: "M12.337 21.994a10 10 0 1 1 9.588-8.767",
      },
    ],
    [
      "path",
      {
        d: "m14 18 4 4 4-4",
      },
    ],
    [
      "path",
      {
        d: "M18 14v8",
      },
    ],
  ],
};

/**
 * Creates the clock-arrow-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ClockArrowDown(options) {
  return createIcon(definition, options);
}

export default ClockArrowDown;
