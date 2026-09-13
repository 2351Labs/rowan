import { createIcon } from "../icon.js";

const definition = {
  name: "plug-2",
  nodes: [
    [
      "path",
      {
        d: "M9 2v6",
      },
    ],
    [
      "path",
      {
        d: "M15 2v6",
      },
    ],
    [
      "path",
      {
        d: "M12 17v5",
      },
    ],
    [
      "path",
      {
        d: "M5 8h14",
      },
    ],
    [
      "path",
      {
        d: "M6 11V8h12v3a6 6 0 1 1-12 0Z",
      },
    ],
  ],
};

/**
 * Creates the plug-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Plug2(options) {
  return createIcon(definition, options);
}

export default Plug2;
