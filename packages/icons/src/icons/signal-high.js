import { createIcon } from "../icon.js";

const definition = {
  name: "signal-high",
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
    [
      "path",
      {
        d: "M12 20v-8",
      },
    ],
    [
      "path",
      {
        d: "M17 20V8",
      },
    ],
  ],
};

/**
 * Creates the signal-high icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SignalHigh(options) {
  return createIcon(definition, options);
}

export default SignalHigh;
