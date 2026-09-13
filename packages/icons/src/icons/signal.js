import { createIcon } from "../icon.js";

const definition = {
  name: "signal",
  nodes: [
    [
      "path",
      {
        d: "M2 20h.01",
      },
    ],
    [
      "path",
      {
        d: "M7 20v-4",
      },
    ],
    [
      "path",
      {
        d: "M12 20v-8",
      },
    ],
    [
      "path",
      {
        d: "M17 20V8",
      },
    ],
    [
      "path",
      {
        d: "M22 4v16",
      },
    ],
  ],
};

/**
 * Creates the signal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Signal(options) {
  return createIcon(definition, options);
}

export default Signal;
