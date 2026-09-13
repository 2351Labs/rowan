import { createIcon } from "../icon.js";

const definition = {
  name: "clock-alert",
  nodes: [
    [
      "path",
      {
        d: "M12 6v6l4 2",
      },
    ],
    [
      "path",
      {
        d: "M20 12v5",
      },
    ],
    [
      "path",
      {
        d: "M20 21h.01",
      },
    ],
    [
      "path",
      {
        d: "M21.25 8.2A10 10 0 1 0 16 21.16",
      },
    ],
  ],
};

/**
 * Creates the clock-alert icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ClockAlert(options) {
  return createIcon(definition, options);
}

export default ClockAlert;
