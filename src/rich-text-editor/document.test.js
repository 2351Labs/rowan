import { expect } from "@esm-bundle/chai";

import {
  documentFromEditingSurface,
  documentFromPlainText,
  normalizeDocument,
  parseStoredDocument,
  renderDocument,
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

    const withHeadingAndLink = {
      blocks: [
        { type: "heading", level: 1, children: [{ text: "Containment" }] },
        {
          type: "paragraph",
          children: [{ text: "Incident", href: "/incidents/12", bold: true }],
        },
      ],
    };
    expect(roundTrip(withHeadingAndLink)).to.deep.equal(normalizeDocument(withHeadingAndLink));

    const surface = document.createElement("div");
    renderDocument(surface, withHeadingAndLink);
    expect(documentFromEditingSurface(surface)).to.deep.equal(
      normalizeDocument(withHeadingAndLink),
    );
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

  it("keeps headings and allowlisted links, and drops images and HTML strings", () => {
    expect(
      normalizeDocument({
        blocks: [
          { type: "heading", level: 2, children: [{ text: "Runbook" }] },
          {
            type: "paragraph",
            children: [{ text: "Open", href: "https://example.test/incident" }],
          },
          { type: "image", src: "<img src=x onerror=alert(1)>" },
        ],
      }),
    ).to.deep.equal({
      blocks: [
        { type: "heading", level: 2, children: [{ text: "Runbook" }] },
        {
          type: "paragraph",
          children: [{ text: "Open", href: "https://example.test/incident" }],
        },
      ],
    });

    expect(
      normalizeDocument({
        blocks: [
          { type: "heading", level: 9, children: [{ text: "Default level" }] },
          {
            type: "paragraph",
            children: [{ text: "XSS", href: "javascript:alert(1)" }],
          },
        ],
      }),
    ).to.deep.equal({
      blocks: [
        { type: "heading", level: 2, children: [{ text: "Default level" }] },
        { type: "paragraph", children: [{ text: "XSS" }] },
      ],
    });

    expect(
      normalizeDocument({
        blocks: [
          {
            type: "paragraph",
            children: [{ text: "Open", href: "/\\evil.example" }],
          },
        ],
      }),
    ).to.deep.equal({
      blocks: [{ type: "paragraph", children: [{ text: "Open" }] }],
    });

    expect(
      normalizeDocument({
        blocks: [
          {
            type: "paragraph",
            children: [{ text: "Open", href: "/\t/evil.example" }],
          },
        ],
      }),
    ).to.deep.equal({
      blocks: [{ type: "paragraph", children: [{ text: "Open" }] }],
    });

    expect(normalizeDocument("<p><strong>Markup</strong></p>")).to.deep.equal({ blocks: [] });
    expect(normalizeDocument("<script>alert(1)</script>")).to.deep.equal({ blocks: [] });
  });
});
