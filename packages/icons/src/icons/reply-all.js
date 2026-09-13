import { createIcon } from "../icon.js";

const definition = {
  name: "reply-all",
  nodes: [
    [
      "path",
      {
        d: "m12 17-5-5 5-5",
      },
    ],
    [
      "path",
      {
        d: "M22 18v-2a4 4 0 0 0-4-4H7",
      },
    ],
    [
      "path",
      {
        d: "m7 17-5-5 5-5",
      },
    ],
  ],
};

/**
 * Creates the reply-all icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ReplyAll(options) {
  return createIcon(definition, options);
}

export default ReplyAll;
