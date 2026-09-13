import { createIcon } from "../icon.js";

const definition = {
  name: "eclipse",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "M12 2a7 7 0 1 0 10 10",
      },
    ],
  ],
};

/**
 * Creates the eclipse icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Eclipse(options) {
  return createIcon(definition, options);
}

export default Eclipse;
