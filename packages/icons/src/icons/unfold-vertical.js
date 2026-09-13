import { createIcon } from "../icon.js";

const definition = {
  name: "unfold-vertical",
  nodes: [
    [
      "path",
      {
        d: "M12 22v-6",
      },
    ],
    [
      "path",
      {
        d: "M12 8V2",
      },
    ],
    [
      "path",
      {
        d: "M4 12H2",
      },
    ],
    [
      "path",
      {
        d: "M10 12H8",
      },
    ],
    [
      "path",
      {
        d: "M16 12h-2",
      },
    ],
    [
      "path",
      {
        d: "M22 12h-2",
      },
    ],
    [
      "path",
      {
        d: "m15 19-3 3-3-3",
      },
    ],
    [
      "path",
      {
        d: "m15 5-3-3-3 3",
      },
    ],
  ],
};

/**
 * Creates the unfold-vertical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UnfoldVertical(options) {
  return createIcon(definition, options);
}

export default UnfoldVertical;
