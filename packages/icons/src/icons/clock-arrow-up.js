import { createIcon } from "../icon.js";

const definition = {
  name: "clock-arrow-up",
  nodes: [
    [
      "path",
      {
        d: "M12 6v6l1.56.78",
      },
    ],
    [
      "path",
      {
        d: "M13.227 21.925a10 10 0 1 1 8.767-9.588",
      },
    ],
    [
      "path",
      {
        d: "m14 18 4-4 4 4",
      },
    ],
    [
      "path",
      {
        d: "M18 22v-8",
      },
    ],
  ],
};

/**
 * Creates the clock-arrow-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ClockArrowUp(options) {
  return createIcon(definition, options);
}

export default ClockArrowUp;
