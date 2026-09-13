import { createIcon } from "../icon.js";

const definition = {
  name: "message-circle-question-mark",
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
        d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
      },
    ],
    [
      "path",
      {
        d: "M12 17h.01",
      },
    ],
  ],
};

/**
 * Creates the message-circle-question-mark icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MessageCircleQuestionMark(options) {
  return createIcon(definition, options);
}

export default MessageCircleQuestionMark;
