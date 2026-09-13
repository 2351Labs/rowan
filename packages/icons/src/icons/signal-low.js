import { createIcon } from "../icon.js";

const definition = {
  name: "signal-low",
  nodes: [
    [
      "path",
      {
        d: "M2 20h.01",
      },
    ],
    [
      "path",
      {
        d: "M7 20v-4",
      },
    ],
  ],
};

/**
 * Creates the signal-low icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SignalLow(options) {
  return createIcon(definition, options);
}

export default SignalLow;
