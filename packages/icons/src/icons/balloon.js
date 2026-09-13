import { createIcon } from "../icon.js";

const definition = {
  name: "balloon",
  nodes: [
    [
      "path",
      {
        d: "M12 16v1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v1",
      },
    ],
    [
      "path",
      {
        d: "M12 6a2 2 0 0 1 2 2",
      },
    ],
    [
      "path",
      {
        d: "M18 8c0 4-3.5 8-6 8s-6-4-6-8a6 6 0 0 1 12 0",
      },
    ],
  ],
};

/**
 * Creates the balloon icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Balloon(options) {
  return createIcon(definition, options);
}

export default Balloon;
