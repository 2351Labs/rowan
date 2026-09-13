import { createIcon } from "../icon.js";

const definition = {
  name: "message-circle-more",
  nodes: [
    [
      "path",
      {
        d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
      },
    ],
    [
      "path",
      {
        d: "M8 12h.01",
      },
    ],
    [
      "path",
      {
        d: "M12 12h.01",
      },
    ],
    [
      "path",
      {
        d: "M16 12h.01",
      },
    ],
  ],
};

/**
 * Creates the message-circle-more icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MessageCircleMore(options) {
  return createIcon(definition, options);
}

export default MessageCircleMore;
