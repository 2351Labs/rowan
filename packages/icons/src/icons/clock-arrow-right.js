import { createIcon } from "../icon.js";

const definition = {
  name: "clock-arrow-right",
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
        d: "M13.5 21.885A10 10 0 1 1 22 12",
      },
    ],
    [
      "path",
      {
        d: "M14 18h8",
      },
    ],
    [
      "path",
      {
        d: "m18 22 4-4-4-4",
      },
    ],
  ],
};

/**
 * Creates the clock-arrow-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ClockArrowRight(options) {
  return createIcon(definition, options);
}

export default ClockArrowRight;
