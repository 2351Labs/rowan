import { createIcon } from "../icon.js";

const definition = {
  name: "door-closed",
  nodes: [
    [
      "path",
      {
        d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16",
      },
    ],
    [
      "path",
      {
        d: "M2 21h20",
      },
    ],
    [
      "path",
      {
        d: "M9 12h.01",
      },
    ],
  ],
};

/**
 * Creates the door-closed icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function DoorClosed(options) {
  return createIcon(definition, options);
}

export default DoorClosed;
