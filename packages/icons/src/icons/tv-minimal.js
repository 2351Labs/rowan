import { createIcon } from "../icon.js";

const definition = {
  name: "tv-minimal",
  nodes: [
    [
      "path",
      {
        d: "M7 21h10",
      },
    ],
    [
      "rect",
      {
        width: "20",
        height: "14",
        x: "2",
        y: "3",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the tv-minimal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TvMinimal(options) {
  return createIcon(definition, options);
}

export default TvMinimal;
