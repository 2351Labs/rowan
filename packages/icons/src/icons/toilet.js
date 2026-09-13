import { createIcon } from "../icon.js";

const definition = {
  name: "toilet",
  nodes: [
    [
      "path",
      {
        d: "M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.598a.5.5 0 0 0-.424.765l1.544 2.47a.5.5 0 0 1-.424.765H5.402a.5.5 0 0 1-.424-.765L7 18",
      },
    ],
    [
      "path",
      {
        d: "M8 18a5 5 0 0 1-5-5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8",
      },
    ],
  ],
};

/**
 * Creates the toilet icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Toilet(options) {
  return createIcon(definition, options);
}

export default Toilet;
