import { createIcon } from "../icon.js";

const definition = {
  name: "message-square-plus",
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
        d: "M12 8v6",
      },
    ],
    [
      "path",
      {
        d: "M9 11h6",
      },
    ],
  ],
};

/**
 * Creates the message-square-plus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MessageSquarePlus(options) {
  return createIcon(definition, options);
}

export default MessageSquarePlus;
