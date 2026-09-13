import { createIcon } from "../icon.js";

const definition = {
  name: "phone-forwarded",
  nodes: [
    [
      "path",
      {
        d: "M14 6h8",
      },
    ],
    [
      "path",
      {
        d: "m18 2 4 4-4 4",
      },
    ],
    [
      "path",
      {
        d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      },
    ],
  ],
};

/**
 * Creates the phone-forwarded icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PhoneForwarded(options) {
  return createIcon(definition, options);
}

export default PhoneForwarded;
