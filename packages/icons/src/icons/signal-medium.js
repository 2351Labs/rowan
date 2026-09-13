import { createIcon } from "../icon.js";

const definition = {
  name: "signal-medium",
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
  ],
};

/**
 * Creates the signal-medium icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SignalMedium(options) {
  return createIcon(definition, options);
}

export default SignalMedium;
