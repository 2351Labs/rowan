import { createIcon } from "../icon.js";

const definition = {
  name: "send",
  nodes: [
    [
      "path",
      {
        d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      },
    ],
    [
      "path",
      {
        d: "m21.854 2.147-10.94 10.939",
      },
    ],
  ],
};

/**
 * Creates the send icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Send(options) {
  return createIcon(definition, options);
}

export default Send;
