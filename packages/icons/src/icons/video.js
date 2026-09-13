import { createIcon } from "../icon.js";

const definition = {
  name: "video",
  nodes: [
    [
      "path",
      {
        d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      },
    ],
    [
      "rect",
      {
        x: "2",
        y: "6",
        width: "14",
        height: "12",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the video icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Video(options) {
  return createIcon(definition, options);
}

export default Video;
