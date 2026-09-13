import { createIcon } from "../icon.js";

const definition = {
  name: "monitor-check",
  nodes: [
    [
      "path",
      {
        d: "m9 10 2 2 4-4",
      },
    ],
    [
      "rect",
      {
        width: "20",
        height: "14",
        x: "2",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M12 17v4",
      },
    ],
    [
      "path",
      {
        d: "M8 21h8",
      },
    ],
  ],
};

/**
 * Creates the monitor-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MonitorCheck(options) {
  return createIcon(definition, options);
}

export default MonitorCheck;
