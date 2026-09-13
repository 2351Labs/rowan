import { createIcon } from "../icon.js";

const definition = {
  name: "message-square-share",
  nodes: [
    [
      "path",
      {
        d: "M12 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4",
      },
    ],
    [
      "path",
      {
        d: "M16 3h6v6",
      },
    ],
    [
      "path",
      {
        d: "m16 9 6-6",
      },
    ],
  ],
};

/**
 * Creates the message-square-share icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MessageSquareShare(options) {
  return createIcon(definition, options);
}

export default MessageSquareShare;
