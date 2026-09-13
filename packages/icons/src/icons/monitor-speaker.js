import { createIcon } from "../icon.js";

const definition = {
  name: "monitor-speaker",
  nodes: [
    [
      "path",
      {
        d: "M5.5 20H8",
      },
    ],
    [
      "path",
      {
        d: "M17 9h.01",
      },
    ],
    [
      "rect",
      {
        width: "10",
        height: "16",
        x: "12",
        y: "4",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M8 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4",
      },
    ],
    [
      "circle",
      {
        cx: "17",
        cy: "15",
        r: "1",
      },
    ],
  ],
};

/**
 * Creates the monitor-speaker icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MonitorSpeaker(options) {
  return createIcon(definition, options);
}

export default MonitorSpeaker;
