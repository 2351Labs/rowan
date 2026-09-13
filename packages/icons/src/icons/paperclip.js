import { createIcon } from "../icon.js";

const definition = {
  name: "paperclip",
  nodes: [
    [
      "path",
      {
        d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
      },
    ],
  ],
};

/**
 * Creates the paperclip icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Paperclip(options) {
  return createIcon(definition, options);
}

export default Paperclip;
