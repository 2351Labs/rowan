import { createIcon } from "../icon.js";

const definition = {
  name: "captions-off",
  nodes: [
    [
      "path",
      {
        d: "M10.5 5H19a2 2 0 0 1 2 2v8.5",
      },
    ],
    [
      "path",
      {
        d: "M17 11h-.5",
      },
    ],
    [
      "path",
      {
        d: "M19 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2",
      },
    ],
    [
      "path",
      {
        d: "m2 2 20 20",
      },
    ],
    [
      "path",
      {
        d: "M7 11h4",
      },
    ],
    [
      "path",
      {
        d: "M7 15h2.5",
      },
    ],
  ],
};

/**
 * Creates the captions-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CaptionsOff(options) {
  return createIcon(definition, options);
}

export default CaptionsOff;
