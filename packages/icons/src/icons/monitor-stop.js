import { createIcon } from "../icon.js";

const definition = {
  name: "monitor-stop",
  nodes: [
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
    [
      "rect",
      {
        x: "2",
        y: "3",
        width: "20",
        height: "14",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        x: "9",
        y: "7",
        width: "6",
        height: "6",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the monitor-stop icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MonitorStop(options) {
  return createIcon(definition, options);
}

export default MonitorStop;
