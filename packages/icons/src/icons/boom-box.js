import { createIcon } from "../icon.js";

const definition = {
  name: "boom-box",
  nodes: [
    [
      "path",
      {
        d: "M4 9V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4",
      },
    ],
    [
      "path",
      {
        d: "M8 8v1",
      },
    ],
    [
      "path",
      {
        d: "M12 8v1",
      },
    ],
    [
      "path",
      {
        d: "M16 8v1",
      },
    ],
    [
      "rect",
      {
        width: "20",
        height: "12",
        x: "2",
        y: "9",
        rx: "2",
      },
    ],
    [
      "circle",
      {
        cx: "8",
        cy: "15",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "16",
        cy: "15",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the boom-box icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BoomBox(options) {
  return createIcon(definition, options);
}

export default BoomBox;
