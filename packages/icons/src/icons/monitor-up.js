import { createIcon } from "../icon.js";

const definition = {
  name: "monitor-up",
  nodes: [
    [
      "path",
      {
        d: "m9 10 3-3 3 3",
      },
    ],
    [
      "path",
      {
        d: "M12 13V7",
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
 * Creates the monitor-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MonitorUp(options) {
  return createIcon(definition, options);
}

export default MonitorUp;
