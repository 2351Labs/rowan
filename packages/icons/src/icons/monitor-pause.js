import { createIcon } from "../icon.js";

const definition = {
  name: "monitor-pause",
  nodes: [
    [
      "path",
      {
        d: "M10 13V7",
      },
    ],
    [
      "path",
      {
        d: "M14 13V7",
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
 * Creates the monitor-pause icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MonitorPause(options) {
  return createIcon(definition, options);
}

export default MonitorPause;
