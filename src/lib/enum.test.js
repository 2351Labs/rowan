import { expect } from "@esm-bundle/chai";
import { normalizeEnum, reflectEnum, rewriteEnumAttribute } from "./enum.js";

const TONES = new Set(["info", "success", "warning", "danger"]);

describe("enum helpers", () => {
  it("canonicalizes supported values and falls back otherwise", () => {
    expect(normalizeEnum(" SUCCESS ", TONES, "info")).to.equal("success");
    expect(normalizeEnum("loud", TONES, "info")).to.equal("info");
    expect(normalizeEnum(null, TONES, "info")).to.equal("info");
  });

  it("omits the documented default when reflecting", () => {
    const writes = [];
    const element = {
      reflectString(name, value) {
        writes.push([name, value]);
      },
    };

    expect(reflectEnum(element, "tone", "warning", TONES, "info")).to.equal("warning");
    expect(reflectEnum(element, "tone", "INFO", TONES, "info")).to.equal("info");
    expect(writes).to.deep.equal([
      ["tone", "warning"],
      ["tone", null],
    ]);
  });

  it("rewrites non-canonical attributes and leaves canonical ones alone", () => {
    const writes = [];
    const element = {
      reflectString(name, value) {
        writes.push([name, value]);
      },
    };

    expect(rewriteEnumAttribute(element, "tone", " DANGER ", TONES, "info")).to.equal(true);
    expect(rewriteEnumAttribute(element, "tone", "danger", TONES, "info")).to.equal(false);
    expect(rewriteEnumAttribute(element, "tone", "loud", TONES, "info")).to.equal(true);
    expect(writes).to.deep.equal([
      ["tone", "danger"],
      ["tone", null],
    ]);
  });
});
