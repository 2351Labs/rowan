import { createIcon } from "../icon.js";

const definition = {
  name: "fork-knife",
  nodes: [
    [
      "path",
      {
        d: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",
      },
    ],
    [
      "path",
      {
        d: "M7 2v20",
      },
    ],
    [
      "path",
      {
        d: "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",
      },
    ],
  ],
};

/**
 * Creates the fork-knife icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ForkKnife(options) {
  return createIcon(definition, options);
}

export default ForkKnife;
