import { createIcon } from "../icon.js";

const definition = {
  name: "monitor-smartphone",
  nodes: [
    [
      "path",
      {
        d: "M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8",
      },
    ],
    [
      "path",
      {
        d: "M10 19v-3.96 3.15",
      },
    ],
    [
      "path",
      {
        d: "M7 19h5",
      },
    ],
    [
      "rect",
      {
        width: "6",
        height: "10",
        x: "16",
        y: "12",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the monitor-smartphone icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MonitorSmartphone(options) {
  return createIcon(definition, options);
}

export default MonitorSmartphone;
