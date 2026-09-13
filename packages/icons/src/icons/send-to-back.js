import { createIcon } from "../icon.js";

const definition = {
  name: "send-to-back",
  nodes: [
    [
      "rect",
      {
        x: "14",
        y: "14",
        width: "8",
        height: "8",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        x: "2",
        y: "2",
        width: "8",
        height: "8",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M7 14v1a2 2 0 0 0 2 2h1",
      },
    ],
    [
      "path",
      {
        d: "M14 7h1a2 2 0 0 1 2 2v1",
      },
    ],
  ],
};

/**
 * Creates the send-to-back icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SendToBack(options) {
  return createIcon(definition, options);
}

export default SendToBack;
