import { expect } from "@esm-bundle/chai";

import {
  documentFromPlainText,
  normalizeDocument,
  parseStoredDocument,
  serializeDocument,
} from "./document.js";

function roundTrip(value) {
  return parseStoredDocument(serializeDocument(value));
}

describe("rich-text document", () => {
  it("round-trips paragraphs, lists, marks, and empty documents", () => {
    const empty = { blocks: [] };
    expect(roundTrip(empty)).to.deep.equal(empty);
    expect(normalizeDocument(null)).to.deep.equal(empty);
    expect(normalizeDocument(undefined)).to.deep.equal(empty);

    const documentValue = {
      blocks: [
        {
          type: "paragraph",
          children: [
            { text: "Bold ", bold: true },
            { text: "italic ", italic: true },
            { text: "underline", underline: true },
          ],
        },
        {
          type: "unordered-list",
          items: [[{ text: "Open the record" }], [{ text: "Notify on-call", bold: true }]],
        },
        {
          type: "ordered-list",
          items: [[{ text: "Contain" }], [{ text: "Recover", italic: true }]],
        },
      ],
    };

    expect(roundTrip(documentValue)).to.deep.equal(normalizeDocument(documentValue));
  });

  it("round-trips plain-text documents as paragraph blocks", () => {
    const fromPlain = documentFromPlainText("Open the incident\nNotify the on-call lead");
    expect(fromPlain).to.deep.equal({
      blocks: [
        { type: "paragraph", children: [{ text: "Open the incident" }] },
        { type: "paragraph", children: [{ text: "Notify the on-call lead" }] },
      ],
    });
    expect(roundTrip(fromPlain)).to.deep.equal(fromPlain);
  });

  it("drops unknown block types and does not interpret HTML strings as markup", () => {
    expect(
      normalizeDocument({
        blocks: [
          { type: "heading", children: [{ text: "Not a heading" }] },
          { type: "paragraph", children: [{ text: "Keep" }] },
          { type: "image", src: "<img src=x onerror=alert(1)>" },
        ],
      }),
    ).to.deep.equal({
      blocks: [{ type: "paragraph", children: [{ text: "Keep" }] }],
    });

    expect(normalizeDocument("<p><strong>Markup</strong></p>")).to.deep.equal({ blocks: [] });
    expect(normalizeDocument("<script>alert(1)</script>")).to.deep.equal({ blocks: [] });
  });
});
