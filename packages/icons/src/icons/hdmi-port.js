import { createIcon } from "../icon.js";

const definition = {
  name: "hdmi-port",
  nodes: [
    [
      "path",
      {
        d: "M22 9a1 1 0 00-1-1H3a1 1 0 00-1 1v4a1 1 0 001 1h.5a2 2 0 011.6.8l.3.4A2 2 0 007 16h10a2 2 0 001.6-.8l.3-.4a2 2 0 011.6-.8h.5a1 1 0 001-1z",
      },
    ],
    [
      "path",
      {
        d: "M8 12h8",
      },
    ],
  ],
};

/**
 * Creates the hdmi-port icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function HdmiPort(options) {
  return createIcon(definition, options);
}

export default HdmiPort;
