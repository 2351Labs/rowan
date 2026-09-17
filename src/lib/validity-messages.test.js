import { expect } from "@esm-bundle/chai";
import "../checkbox/checkbox.js";
import {
  ROWAN_VALIDITY_MESSAGES,
  resetValidityMessages,
  setValidityMessageResolver,
  setValidityMessages,
  validityMessage,
} from "./validity-messages.js";

const nextMicrotask = () => Promise.resolve();

describe("validity messages", () => {
  afterEach(() => {
    resetValidityMessages();
    document.body.innerHTML = "";
  });

  it("returns English defaults and ignores unknown keys", () => {
    expect(validityMessage("valueMissing.checkbox")).to.equal("Please check this box.");
    expect(validityMessage("valueMissing.checkbox")).to.equal(
      ROWAN_VALIDITY_MESSAGES["valueMissing.checkbox"],
    );
    expect(validityMessage("not-a-key")).to.equal("");
  });

  it("applies key overrides without mutating defaults", () => {
    setValidityMessages({ "valueMissing.checkbox": "Cochez cette case." });
    expect(validityMessage("valueMissing.checkbox")).to.equal("Cochez cette case.");
    expect(validityMessage("valueMissing.option")).to.equal("Please select an option.");
    expect(ROWAN_VALIDITY_MESSAGES["valueMissing.checkbox"]).to.equal("Please check this box.");

    setValidityMessages({ "valueMissing.option": "Choisissez une option." });
    expect(validityMessage("valueMissing.checkbox")).to.equal("Please check this box.");
    expect(validityMessage("valueMissing.option")).to.equal("Choisissez une option.");
  });

  it("lets a resolver localize keys and falls through when it returns nothing", () => {
    setValidityMessages({ "valueMissing.checkbox": "Override" });
    setValidityMessageResolver((key, fallback) => {
      if (key === "valueMissing.option") return `i18n:${fallback}`;
      return null;
    });

    expect(validityMessage("valueMissing.option")).to.equal("i18n:Please select an option.");
    expect(validityMessage("valueMissing.checkbox")).to.equal("Override");
  });

  it("uses the catalog on a required checkbox", async () => {
    setValidityMessages({ "valueMissing.checkbox": "Cochez cette case." });
    const element = document.createElement("rowan-checkbox");
    element.required = true;
    document.body.append(element);
    await nextMicrotask();

    expect(element.checkValidity()).to.equal(false);
    expect(element.validationMessage).to.equal("Cochez cette case.");

    element.setCustomValidity("Already accepted");
    expect(element.validationMessage).to.equal("Already accepted");
  });
});
