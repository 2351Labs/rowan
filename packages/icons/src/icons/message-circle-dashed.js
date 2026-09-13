import { createIcon } from "../icon.js";

const definition = {
  name: "message-circle-dashed",
  nodes: [
    [
      "path",
      {
        d: "M10.1 2.182a10 10 0 0 1 3.8 0",
      },
    ],
    [
      "path",
      {
        d: "M13.9 21.818a10 10 0 0 1-3.8 0",
      },
    ],
    [
      "path",
      {
        d: "M17.609 3.72a10 10 0 0 1 2.69 2.7",
      },
    ],
    [
      "path",
      {
        d: "M2.182 13.9a10 10 0 0 1 0-3.8",
      },
    ],
    [
      "path",
      {
        d: "M20.28 17.61a10 10 0 0 1-2.7 2.69",
      },
    ],
    [
      "path",
      {
        d: "M21.818 10.1a10 10 0 0 1 0 3.8",
      },
    ],
    [
      "path",
      {
        d: "M3.721 6.391a10 10 0 0 1 2.7-2.69",
      },
    ],
    [
      "path",
      {
        d: "m6.163 21.117-2.906.85a1 1 0 0 1-1.236-1.169l.965-2.98",
      },
    ],
  ],
};

/**
 * Creates the message-circle-dashed icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MessageCircleDashed(options) {
  return createIcon(definition, options);
}

export default MessageCircleDashed;
