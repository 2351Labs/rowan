import { createIcon } from "../icon.js";

const definition = {
  name: "reply",
  nodes: [
    [
      "path",
      {
        d: "M20 18v-2a4 4 0 0 0-4-4H4",
      },
    ],
    [
      "path",
      {
        d: "m9 17-5-5 5-5",
      },
    ],
  ],
};

/**
 * Creates the reply icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Reply(options) {
  return createIcon(definition, options);
}

export default Reply;
