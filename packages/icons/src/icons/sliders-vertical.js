import { createIcon } from "../icon.js";

const definition = {
  name: "sliders-vertical",
  nodes: [
    [
      "path",
      {
        d: "M10 8h4",
      },
    ],
    [
      "path",
      {
        d: "M12 21v-9",
      },
    ],
    [
      "path",
      {
        d: "M12 8V3",
      },
    ],
    [
      "path",
      {
        d: "M17 16h4",
      },
    ],
    [
      "path",
      {
        d: "M19 12V3",
      },
    ],
    [
      "path",
      {
        d: "M19 21v-5",
      },
    ],
    [
      "path",
      {
        d: "M3 14h4",
      },
    ],
    [
      "path",
      {
        d: "M5 10V3",
      },
    ],
    [
      "path",
      {
        d: "M5 21v-7",
      },
    ],
  ],
};

/**
 * Creates the sliders-vertical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SlidersVertical(options) {
  return createIcon(definition, options);
}

export default SlidersVertical;
