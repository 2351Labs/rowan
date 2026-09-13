import { createIcon } from "../icon.js";

const definition = {
  name: "mail-minus",
  nodes: [
    [
      "path",
      {
        d: "M22 15V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",
      },
    ],
    [
      "path",
      {
        d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
      },
    ],
    [
      "path",
      {
        d: "M16 19h6",
      },
    ],
  ],
};

/**
 * Creates the mail-minus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MailMinus(options) {
  return createIcon(definition, options);
}

export default MailMinus;
