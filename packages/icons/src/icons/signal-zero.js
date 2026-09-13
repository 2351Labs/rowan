import { createIcon } from "../icon.js";

const definition = {
  name: "signal-zero",
  nodes: [
    [
      "path",
      {
        d: "M2 20h.01",
      },
    ],
  ],
};

/**
 * Creates the signal-zero icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SignalZero(options) {
  return createIcon(definition, options);
}

export default SignalZero;
