import { createIcon } from "../icon.js";

const definition = {
  name: "road",
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
        d: "M12 5V3",
      },
    ],
    [
      "path",
      {
        d: "M12 9v3",
      },
    ],
    [
      "path",
      {
        d: "M2.077 18.449A2 2 0 0 0 4 21h16a2 2 0 0 0 1.924-2.55l-4-14A2 2 0 0 0 16 3H8a2 2 0 0 0-1.924 1.45z",
      },
    ],
  ],
};

/**
 * Creates the road icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Road(options) {
  return createIcon(definition, options);
}

export default Road;
