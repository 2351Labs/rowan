import { createIcon } from "../icon.js";

const definition = {
  name: "monitor-x",
  nodes: [
    [
      "path",
      {
        d: "m14.5 12.5-5-5",
      },
    ],
    [
      "path",
      {
        d: "m9.5 12.5 5-5",
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
 * Creates the monitor-x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MonitorX(options) {
  return createIcon(definition, options);
}

export default MonitorX;
