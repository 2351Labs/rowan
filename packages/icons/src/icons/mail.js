import { createIcon } from "../icon.js";

const definition = {
  name: "mail",
  nodes: [
    [
      "path",
      {
        d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",
      },
    ],
    [
      "rect",
      {
        x: "2",
        y: "4",
        width: "20",
        height: "16",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the mail icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Mail(options) {
  return createIcon(definition, options);
}

export default Mail;
