import { createIcon } from "../icon.js";

const definition = {
  name: "qr-code",
  nodes: [
    [
      "rect",
      {
        width: "5",
        height: "5",
        x: "3",
        y: "3",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        width: "5",
        height: "5",
        x: "16",
        y: "3",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        width: "5",
        height: "5",
        x: "3",
        y: "16",
        rx: "1",
      },
    ],
    [
      "path",
      {
        d: "M21 16h-3a2 2 0 0 0-2 2v3",
      },
    ],
    [
      "path",
      {
        d: "M21 21v.01",
      },
    ],
    [
      "path",
      {
        d: "M12 7v3a2 2 0 0 1-2 2H7",
      },
    ],
    [
      "path",
      {
        d: "M3 12h.01",
      },
    ],
    [
      "path",
      {
        d: "M12 3h.01",
      },
    ],
    [
      "path",
      {
        d: "M12 16v.01",
      },
    ],
    [
      "path",
      {
        d: "M16 12h1",
      },
    ],
    [
      "path",
      {
        d: "M21 12v.01",
      },
    ],
    [
      "path",
      {
        d: "M12 21v-1",
      },
    ],
  ],
};

/**
 * Creates the qr-code icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function QrCode(options) {
  return createIcon(definition, options);
}

export default QrCode;
