import { createIcon } from "../icon.js";

const definition = {
  name: "refresh-ccw-dot",
  nodes: [
    [
      "path",
      {
        d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
      },
    ],
    [
      "path",
      {
        d: "M3 3v5h5",
      },
    ],
    [
      "path",
      {
        d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",
      },
    ],
    [
      "path",
      {
        d: "M16 16h5v5",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "1",
      },
    ],
  ],
};

/**
 * Creates the refresh-ccw-dot icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function RefreshCcwDot(options) {
  return createIcon(definition, options);
}

export default RefreshCcwDot;
