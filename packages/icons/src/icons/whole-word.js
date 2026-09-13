import { createIcon } from "../icon.js";

const definition = {
  name: "whole-word",
  nodes: [
    [
      "circle",
      {
        cx: "7",
        cy: "12",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "M10 9v6",
      },
    ],
    [
      "circle",
      {
        cx: "17",
        cy: "12",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "M14 7v8",
      },
    ],
    [
      "path",
      {
        d: "M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1",
      },
    ],
  ],
};

/**
 * Creates the whole-word icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function WholeWord(options) {
  return createIcon(definition, options);
}

export default WholeWord;
