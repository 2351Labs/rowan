import { createIcon } from "../icon.js";

const definition = {
  name: "phi",
  nodes: [
    [
      "path",
      {
        d: "M12 2v20",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "7",
      },
    ],
  ],
};

/**
 * Creates the phi icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Phi(options) {
  return createIcon(definition, options);
}

export default Phi;
