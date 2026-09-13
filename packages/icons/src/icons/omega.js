import { createIcon } from "../icon.js";

const definition = {
  name: "omega",
  nodes: [
    [
      "path",
      {
        d: "M3 20h4.5a.5.5 0 0 0 .5-.5v-.282a.52.52 0 0 0-.247-.437 8 8 0 1 1 8.494-.001.52.52 0 0 0-.247.438v.282a.5.5 0 0 0 .5.5H21",
      },
    ],
  ],
};

/**
 * Creates the omega icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Omega(options) {
  return createIcon(definition, options);
}

export default Omega;
