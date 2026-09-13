import { createIcon } from "../icon.js";

const definition = {
  name: "network",
  nodes: [
    [
      "rect",
      {
        x: "16",
        y: "16",
        width: "6",
        height: "6",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        x: "2",
        y: "16",
        width: "6",
        height: "6",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        x: "9",
        y: "2",
        width: "6",
        height: "6",
        rx: "1",
      },
    ],
    [
      "path",
      {
        d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3",
      },
    ],
    [
      "path",
      {
        d: "M12 12V8",
      },
    ],
  ],
};

/**
 * Creates the network icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Network(options) {
  return createIcon(definition, options);
}

export default Network;
