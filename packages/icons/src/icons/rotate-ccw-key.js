import { createIcon } from "../icon.js";

const definition = {
  name: "rotate-ccw-key",
  nodes: [
    [
      "path",
      {
        d: "M12 7v6",
      },
    ],
    [
      "path",
      {
        d: "M12 9h2",
      },
    ],
    [
      "path",
      {
        d: "M3 12a9 9 0 1 0 9-9 9.74 9.74 0 0 0-6.74 2.74L3 8",
      },
    ],
    [
      "path",
      {
        d: "M3 3v5h5",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "15",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the rotate-ccw-key icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function RotateCcwKey(options) {
  return createIcon(definition, options);
}

export default RotateCcwKey;
