import { expect } from "@esm-bundle/chai";
import "./text-field.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-text-field", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects value property and attribute", async () => {
    const element = document.createElement("rowan-text-field");
    document.body.append(element);
    await nextMicrotask();

    element.value = "spruce";
    expect(element.getAttribute("value")).to.equal("spruce");

    element.setAttribute("value", "cedar");
    expect(element.value).to.equal("cedar");
  });

  it("emits rowan-change when user changes the value", async () => {
    const element = document.createElement("rowan-text-field");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    const input = element.shadowRoot.querySelector('input[type="text"]');
    input.value = "alpine";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(eventCount).to.equal(1);
  });

  it("keeps user input handling after reconnecting", async () => {
    const element = document.createElement("rowan-text-field");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    element.remove();
    document.body.append(element);
    await nextMicrotask();

    const input = element.shadowRoot.querySelector('input[type="text"]');
    input.value = "alpine";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(element.value).to.equal("alpine");
    expect(eventCount).to.equal(1);
  });

  it("does not emit rowan-change when parent sets value", async () => {
    const element = document.createElement("rowan-text-field");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    element.value = "silent";
    await nextMicrotask();

    expect(eventCount).to.equal(0);
  });

  it("submits value through FACE", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-text-field");

    element.name = "forest";
    element.value = "pine";

    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    const formData = new FormData(form);
    expect(formData.get("forest")).to.equal("pine");
  });

  it("honors fieldset disabled state through FACE", async () => {
    const form = document.createElement("form");
    const fieldset = document.createElement("fieldset");
    const element = document.createElement("rowan-text-field");
    element.name = "forest";
    element.value = "pine";
    fieldset.append(element);
    form.append(fieldset);
    document.body.append(form);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    const input = element.shadowRoot.querySelector("input");
    fieldset.disabled = true;
    await nextMicrotask();

    expect(input.disabled).to.equal(true);
    expect(element.internals.ariaDisabled).to.equal("true");
    expect(new FormData(form).get("forest")).to.equal(null);

    input.value = "cedar";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(element.value).to.equal("pine");
    expect(eventCount).to.equal(0);

    fieldset.disabled = false;
    await nextMicrotask();

    expect(input.disabled).to.equal(false);
    input.value = "cedar";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(element.value).to.equal("cedar");
    expect(eventCount).to.equal(1);
  });

  it("reports invalid when required and empty", async () => {
    const element = document.createElement("rowan-text-field");
    element.required = true;
    document.body.append(element);
    await nextMicrotask();

    expect(element.checkValidity()).to.equal(false);

    element.value = "oak";
    await nextMicrotask();

    expect(element.checkValidity()).to.equal(true);
  });

  it("mirrors native email validity through the FACE host", async () => {
    const element = document.createElement("rowan-text-field");
    element.type = "email";
    element.value = "not-an-email";
    document.body.append(element);
    await nextMicrotask();

    expect(element.shadowRoot.querySelector("input").validity.typeMismatch).to.equal(true);
    expect(element.internals.validity.typeMismatch).to.equal(true);
    expect(element.checkValidity()).to.equal(false);

    element.value = "ada@example.com";
    await nextMicrotask();

    expect(element.checkValidity()).to.equal(true);
  });

  it("mirrors native URL validity through the FACE host", async () => {
    const element = document.createElement("rowan-text-field");
    element.type = "url";
    element.value = "rowan.dev";
    document.body.append(element);
    await nextMicrotask();

    expect(element.internals.validity.typeMismatch).to.equal(true);
    expect(element.checkValidity()).to.equal(false);

    element.value = "https://rowan.dev";
    await nextMicrotask();

    expect(element.checkValidity()).to.equal(true);
  });

  it("mirrors native pattern validity through the FACE host", async () => {
    const element = document.createElement("rowan-text-field");
    element.pattern = "[A-Z]{3}";
    element.value = "pine";
    document.body.append(element);
    await nextMicrotask();

    expect(element.shadowRoot.querySelector("input").validity.patternMismatch).to.equal(true);
    expect(element.internals.validity.patternMismatch).to.equal(true);
    expect(element.checkValidity()).to.equal(false);

    element.value = "OAK";
    await nextMicrotask();

    expect(element.checkValidity()).to.equal(true);
  });

  it("synchronizes validity when native constraints change", async () => {
    const element = document.createElement("rowan-text-field");
    element.value = "not-an-email";
    document.body.append(element);
    await nextMicrotask();

    expect(element.checkValidity()).to.equal(true);

    element.type = "email";
    expect(element.internals.validity.typeMismatch).to.equal(true);
    expect(element.checkValidity()).to.equal(false);

    element.type = "text";
    element.pattern = "[A-Z]{3}";
    expect(element.internals.validity.patternMismatch).to.equal(true);
    expect(element.checkValidity()).to.equal(false);
  });

  it("syncs host a11y states for required, invalid, and label", async () => {
    const element = document.createElement("rowan-text-field");
    element.required = true;
    element.label = "Forest name";
    document.body.append(element);
    await nextMicrotask();

    expect(element.internals.role).to.equal("textbox");
    expect(element.internals.ariaRequired).to.equal("true");
    expect(element.internals.ariaInvalid).to.equal("true");
    expect(element.internals.ariaLabel).to.equal("Forest name");

    element.value = "Pine";
    element.disabled = true;
    await nextMicrotask();

    expect(element.internals.ariaInvalid).to.equal("false");
    expect(element.internals.ariaDisabled).to.equal("true");
  });
});
