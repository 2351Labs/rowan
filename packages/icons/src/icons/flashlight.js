import { createIcon } from "../icon.js";

const definition = {
  name: "flashlight",
  nodes: [
    [
      "path",
      {
        d: "M12 13v1",
      },
    ],
    [
      "path",
      {
        d: "M17 2a1 1 0 0 1 1 1v4a3 3 0 0 1-.6 1.8l-.6.8A4 4 0 0 0 16 12v8a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-8a4 4 0 0 0-.8-2.4l-.6-.8A3 3 0 0 1 6 7V3a1 1 0 0 1 1-1z",
      },
    ],
    [
      "path",
      {
        d: "M6 6h12",
      },
    ],
  ],
};

/**
 * Creates the flashlight icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Flashlight(options) {
  return createIcon(definition, options);
}

export default Flashlight;
