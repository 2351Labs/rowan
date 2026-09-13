import { createIcon } from "../icon.js";

const definition = {
  name: "scroll",
  nodes: [
    [
      "path",
      {
        d: "M19 17V5a2 2 0 0 0-2-2H4",
      },
    ],
    [
      "path",
      {
        d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
      },
    ],
  ],
};

/**
 * Creates the scroll icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Scroll(options) {
  return createIcon(definition, options);
}

export default Scroll;
