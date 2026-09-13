import { createIcon } from "../icon.js";

const definition = {
  name: "zap",
  nodes: [
    [
      "path",
      {
        d: "M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z",
      },
    ],
  ],
};

/**
 * Creates the zap icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Zap(options) {
  return createIcon(definition, options);
}

export default Zap;
