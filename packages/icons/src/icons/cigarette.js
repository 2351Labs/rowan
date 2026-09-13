import { createIcon } from "../icon.js";

const definition = {
  name: "cigarette",
  nodes: [
    [
      "path",
      {
        d: "M17 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14",
      },
    ],
    [
      "path",
      {
        d: "M18 8c0-2.5-2-2.5-2-5",
      },
    ],
    [
      "path",
      {
        d: "M21 16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
      },
    ],
    [
      "path",
      {
        d: "M22 8c0-2.5-2-2.5-2-5",
      },
    ],
    [
      "path",
      {
        d: "M7 12v4",
      },
    ],
  ],
};

/**
 * Creates the cigarette icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Cigarette(options) {
  return createIcon(definition, options);
}

export default Cigarette;
