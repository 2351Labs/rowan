import { createIcon } from "../icon.js";

const definition = {
  name: "tangent",
  nodes: [
    [
      "circle",
      {
        cx: "17",
        cy: "4",
        r: "2",
      },
    ],
    [
      "path",
      {
        d: "M15.59 5.41 5.41 15.59",
      },
    ],
    [
      "circle",
      {
        cx: "4",
        cy: "17",
        r: "2",
      },
    ],
    [
      "path",
      {
        d: "M12 22s-4-9-1.5-11.5S22 12 22 12",
      },
    ],
  ],
};

/**
 * Creates the tangent icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Tangent(options) {
  return createIcon(definition, options);
}

export default Tangent;
