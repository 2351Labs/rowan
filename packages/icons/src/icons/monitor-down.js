import { createIcon } from "../icon.js";

const definition = {
  name: "monitor-down",
  nodes: [
    [
      "path",
      {
        d: "M12 13V7",
      },
    ],
    [
      "path",
      {
        d: "m15 10-3 3-3-3",
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
 * Creates the monitor-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MonitorDown(options) {
  return createIcon(definition, options);
}

export default MonitorDown;
