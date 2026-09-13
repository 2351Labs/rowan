import { createIcon } from "../icon.js";

const definition = {
  name: "signpost-big",
  nodes: [
    [
      "path",
      {
        d: "M10 9H4L2 7l2-2h6",
      },
    ],
    [
      "path",
      {
        d: "M14 5h6l2 2-2 2h-6",
      },
    ],
    [
      "path",
      {
        d: "M10 22V4a2 2 0 1 1 4 0v18",
      },
    ],
    [
      "path",
      {
        d: "M8 22h8",
      },
    ],
  ],
};

/**
 * Creates the signpost-big icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SignpostBig(options) {
  return createIcon(definition, options);
}

export default SignpostBig;
