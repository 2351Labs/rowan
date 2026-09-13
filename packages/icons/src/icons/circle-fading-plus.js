import { createIcon } from "../icon.js";

const definition = {
  name: "circle-fading-plus",
  nodes: [
    [
      "path",
      {
        d: "M12 2a10 10 0 0 1 7.38 16.75",
      },
    ],
    [
      "path",
      {
        d: "M12 8v8",
      },
    ],
    [
      "path",
      {
        d: "M16 12H8",
      },
    ],
    [
      "path",
      {
        d: "M2.5 8.875a10 10 0 0 0-.5 3",
      },
    ],
    [
      "path",
      {
        d: "M2.83 16a10 10 0 0 0 2.43 3.4",
      },
    ],
    [
      "path",
      {
        d: "M4.636 5.235a10 10 0 0 1 .891-.857",
      },
    ],
    [
      "path",
      {
        d: "M8.644 21.42a10 10 0 0 0 7.631-.38",
      },
    ],
  ],
};

/**
 * Creates the circle-fading-plus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleFadingPlus(options) {
  return createIcon(definition, options);
}

export default CircleFadingPlus;
