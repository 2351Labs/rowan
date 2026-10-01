import { expect } from "@esm-bundle/chai";

import { lowerCaseForLocale, resolveLocale, upperCaseForLocale } from "./locale.js";

describe("locale resolution", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("uses an explicit locale before inherited language", () => {
    const parent = document.createElement("div");
    parent.lang = "ar-EG";
    const child = document.createElement("div");
    parent.append(child);
    document.body.append(parent);

    expect(resolveLocale(child, "fr-CA")).to.equal("fr-CA");
  });

  it("finds the nearest inherited language through a shadow boundary", () => {
    const host = document.createElement("div");
    host.lang = "ar-EG";
    const child = document.createElement("div");
    host.attachShadow({ mode: "open" }).append(child);
    document.body.append(host);

    expect(resolveLocale(child)).to.equal("ar-EG");
  });

  it("uses locale-aware lowercasing and safely falls back for an invalid locale", () => {
    expect(lowerCaseForLocale("I", "tr-TR")).to.equal("\u0131");
    expect(lowerCaseForLocale("ABC", "invalid_locale")).to.equal("abc");
  });

  it("uses locale-aware uppercasing and safely falls back for an invalid locale", () => {
    expect(upperCaseForLocale("i", "tr-TR")).to.equal("\u0130");
    expect(upperCaseForLocale("abc", "invalid_locale")).to.equal("ABC");
  });
});
