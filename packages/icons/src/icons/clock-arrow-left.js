import { createIcon } from "../icon.js";

const definition = {
  name: "clock-arrow-left",
  nodes: [
    [
      "path",
      {
        d: "M12 6v6l1.5.8",
      },
    ],
    [
      "path",
      {
        d: "M12.338 21.994a10 10 0 1 1 9.587-8.767",
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
        d: "m18 22-4-4 4-4",
      },
    ],
  ],
};

/**
 * Creates the clock-arrow-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ClockArrowLeft(options) {
  return createIcon(definition, options);
}

export default ClockArrowLeft;
