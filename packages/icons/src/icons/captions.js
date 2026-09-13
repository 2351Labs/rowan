import { createIcon } from "../icon.js";

const definition = {
  name: "captions",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "14",
        x: "3",
        y: "5",
        rx: "2",
        ry: "2",
      },
    ],
    [
      "path",
      {
        d: "M7 15h4M15 15h2M7 11h2M13 11h4",
      },
    ],
  ],
};

/**
 * Creates the captions icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Captions(options) {
  return createIcon(definition, options);
}

export default Captions;
