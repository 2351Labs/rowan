import { createIcon } from "../icon.js";

const definition = {
  name: "message-square-code",
  nodes: [
    [
      "path",
      {
        d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      },
    ],
    [
      "path",
      {
        d: "m10 8-3 3 3 3",
      },
    ],
    [
      "path",
      {
        d: "m14 14 3-3-3-3",
      },
    ],
  ],
};

/**
 * Creates the message-square-code icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MessageSquareCode(options) {
  return createIcon(definition, options);
}

export default MessageSquareCode;
