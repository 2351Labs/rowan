import { createIcon } from "../icon.js";

const definition = {
  name: "message-square-x",
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
        d: "m14.5 8.5-5 5",
      },
    ],
    [
      "path",
      {
        d: "m9.5 8.5 5 5",
      },
    ],
  ],
};

/**
 * Creates the message-square-x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MessageSquareX(options) {
  return createIcon(definition, options);
}

export default MessageSquareX;
