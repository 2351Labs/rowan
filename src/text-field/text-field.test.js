import { expect } from "@esm-bundle/chai";
import "./text-field.js";

const nextMicrotask = () => Promise.resolve();
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

async function waitForStyles(element) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const stylesheet = element.shadowRoot?.querySelector('link[rel="stylesheet"]');

    if (stylesheet?.sheet) {
      await nextFrame();
      return;
    }

    if (stylesheet) {
      await new Promise((resolve, reject) => {
        stylesheet.addEventListener("load", resolve, { once: true });
        stylesheet.addEventListener("error", reject, { once: true });
      });
      await nextFrame();
      return;
    }

    await nextFrame();
  }

  throw new Error("stylesheet never loaded for <rowan-text-field>");
}

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

  it("keeps the rendered input within its host width", async () => {
    const element = document.createElement("rowan-text-field");
    element.style.inlineSize = "14rem";
    document.body.append(element);
    await nextMicrotask();
    await waitForStyles(element);

    const input = element.shadowRoot.querySelector("input");
    const host = element.getBoundingClientRect();
    const control = input.getBoundingClientRect();

    expect(control.width).to.equal(host.width);
    expect(control.right <= host.right).to.equal(true);
  });

  it("keeps a password value out of the DOM", async () => {
    const element = document.createElement("rowan-text-field");
    element.type = "password";
    document.body.append(element);
    await nextMicrotask();

    element.value = "hunter2";

    expect(element.value).to.equal("hunter2");
    expect(element.hasAttribute("value")).to.equal(false);
    expect(element.outerHTML).to.not.include("hunter2");

    const input = element.shadowRoot.querySelector("input");
    input.value = "typed-secret";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await nextMicrotask();

    expect(element.value).to.equal("typed-secret");
    expect(element.outerHTML).to.not.include("typed-secret");
  });

  it("evicts a markup-provided password value from the attribute", async () => {
    document.body.innerHTML = `<rowan-text-field type="password" value="from-markup"></rowan-text-field>`;
    const element = document.querySelector("rowan-text-field");
    await nextMicrotask();

    expect(element.value).to.equal("from-markup");
    expect(element.hasAttribute("value")).to.equal(false);
  });

  it("canonicalizes type case and evicts password values from type=PASSWORD", async () => {
    document.body.innerHTML = `<rowan-text-field type="PASSWORD" value="from-markup"></rowan-text-field>`;
    const element = document.querySelector("rowan-text-field");
    await nextMicrotask();

    expect(element.type).to.equal("password");
    expect(element.getAttribute("type")).to.equal("password");
    expect(element.value).to.equal("from-markup");
    expect(element.hasAttribute("value")).to.equal(false);
    expect(element.outerHTML).to.not.include("from-markup");
    expect(element.shadowRoot.querySelector("input").type).to.equal("password");
  });

  it("treats unknown types as text", async () => {
    const element = document.createElement("rowan-text-field");
    element.type = "banana";
    document.body.append(element);
    await nextMicrotask();

    expect(element.type).to.equal("text");
    expect(element.hasAttribute("type")).to.equal(false);
    expect(element.shadowRoot.querySelector("input").type).to.equal("text");
  });

  it("evicts the value when type becomes a case-insensitive password", async () => {
    const element = document.createElement("rowan-text-field");
    element.value = "hunter2";
    document.body.append(element);
    await nextMicrotask();

    expect(element.getAttribute("value")).to.equal("hunter2");

    element.type = "Password";
    await nextMicrotask();

    expect(element.type).to.equal("password");
    expect(element.value).to.equal("hunter2");
    expect(element.hasAttribute("value")).to.equal(false);
    expect(element.shadowRoot.querySelector("input").type).to.equal("password");
  });

  it("takes its accessible name from an external label element", async () => {
    document.body.innerHTML = `
      <label for="external-email">Work email</label>
      <rowan-text-field id="external-email"></rowan-text-field>
    `;
    const element = document.querySelector("rowan-text-field");
    await nextMicrotask();
    await nextMicrotask();

    const input = element.shadowRoot.querySelector("input");
    expect(element.labels.length).to.equal(1);
    expect(input.getAttribute("aria-label")).to.equal("Work email");

    document.querySelector("label").textContent = "Personal email";
    await nextMicrotask();
    await nextMicrotask();
    await nextMicrotask();

    expect(input.getAttribute("aria-label")).to.equal("Personal email");
  });

  it("adopts an external label added after connect", async () => {
    const element = document.createElement("rowan-text-field");
    element.id = "late-email";
    document.body.append(element);
    await nextMicrotask();
    await nextMicrotask();

    expect(element.externalLabelText).to.equal("");

    const label = document.createElement("label");
    label.htmlFor = "late-email";
    label.textContent = "Work email";
    document.body.append(label);
    await nextMicrotask();
    await nextMicrotask();

    expect(element.externalLabelText).to.equal("Work email");
    expect(element.shadowRoot.querySelector("input").getAttribute("aria-label")).to.equal(
      "Work email",
    );

    label.textContent = "Personal email";
    await nextMicrotask();
    await nextMicrotask();
    await nextMicrotask();

    expect(element.externalLabelText).to.equal("Personal email");
    expect(element.shadowRoot.querySelector("input").getAttribute("aria-label")).to.equal(
      "Personal email",
    );
  });

  it("adopts a label when the host id is assigned after connect", async () => {
    const label = document.createElement("label");
    label.htmlFor = "late-id";
    label.textContent = "Phone";
    const element = document.createElement("rowan-text-field");
    document.body.append(label, element);
    await nextMicrotask();
    await nextMicrotask();

    expect(element.externalLabelText).to.equal("");

    element.id = "late-id";
    await nextMicrotask();
    await nextMicrotask();

    expect(element.externalLabelText).to.equal("Phone");
    expect(element.shadowRoot.querySelector("input").getAttribute("aria-label")).to.equal("Phone");
  });

  it("prefers the label attribute over an external label", async () => {
    document.body.innerHTML = `
      <label for="both-email">External</label>
      <rowan-text-field id="both-email" label="Attribute"></rowan-text-field>
    `;
    const element = document.querySelector("rowan-text-field");
    await nextMicrotask();
    await nextMicrotask();

    expect(element.shadowRoot.querySelector("input").getAttribute("aria-label")).to.equal(
      "Attribute",
    );
  });

  it("re-enables its inner control when a disabled fieldset is re-enabled", async () => {
    const fieldset = document.createElement("fieldset");
    const element = document.createElement("rowan-text-field");
    fieldset.append(element);
    document.body.append(fieldset);
    await nextMicrotask();

    const input = element.shadowRoot.querySelector("input");

    fieldset.disabled = true;
    await nextMicrotask();
    await nextMicrotask();
    expect(input.disabled).to.equal(true);

    fieldset.disabled = false;
    await nextMicrotask();
    await nextMicrotask();
    expect(input.disabled).to.equal(false);
  });

  it("does not write back into the field during IME composition", async () => {
    const element = document.createElement("rowan-text-field");
    document.body.append(element);
    await nextMicrotask();

    const input = element.shadowRoot.querySelector("input");

    input.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true }));
    input.value = "にほん";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await nextMicrotask();
    await nextMicrotask();

    expect(input.value).to.equal("にほん");

    input.dispatchEvent(new CompositionEvent("compositionend", { bubbles: true }));
    await nextMicrotask();

    expect(element.value).to.equal("にほん");
  });

  it("exposes the standard validity surface", async () => {
    const form = document.createElement("form");
    const element = document.createElement("rowan-text-field");
    element.name = "email";
    element.required = true;
    form.append(element);
    document.body.append(form);
    await nextMicrotask();

    expect(element.form).to.equal(form);
    expect(element.willValidate).to.equal(true);
    expect(element.validity.valueMissing).to.equal(true);
    expect(element.validationMessage).to.not.equal("");

    element.value = "ada@example.com";
    await nextMicrotask();

    expect(element.validity.valid).to.equal(true);
  });

  it("applies setCustomValidity in the same turn", () => {
    const element = document.createElement("rowan-text-field");

    element.setCustomValidity("taken");

    expect(element.validity.customError).to.equal(true);
    expect(element.validationMessage).to.equal("taken");
    expect(element.checkValidity()).to.equal(false);

    element.setCustomValidity("");

    expect(element.validity.customError).to.equal(false);
    expect(element.checkValidity()).to.equal(true);
  });

  it("keeps a consumer custom error through unrelated renders", async () => {
    const element = document.createElement("rowan-text-field");
    document.body.append(element);
    await nextMicrotask();

    element.value = "ada@example.com";
    element.setCustomValidity("Email already registered");

    expect(element.validity.customError).to.equal(true);
    expect(element.validationMessage).to.equal("Email already registered");

    element.placeholder = "Work email";
    await nextMicrotask();
    await nextMicrotask();

    expect(element.validity.customError).to.equal(true);
    expect(element.validationMessage).to.equal("Email already registered");

    element.setCustomValidity("");
    await nextMicrotask();
    await nextMicrotask();

    expect(element.validity.customError).to.equal(false);
    expect(element.validity.valid).to.equal(true);
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

  it("does not paint invalid until blur or reportValidity", async () => {
    const element = document.createElement("rowan-text-field");
    element.required = true;
    document.body.append(element);
    await nextMicrotask();

    expect(element.hasAttribute("invalid")).to.equal(false);
    expect(element.checkValidity()).to.equal(false);

    element.shadowRoot
      .querySelector("input")
      .dispatchEvent(new Event("focusout", { bubbles: true }));
    await nextMicrotask();
    expect(element.hasAttribute("invalid")).to.equal(true);

    element.value = "oak";
    await nextMicrotask();
    expect(element.hasAttribute("invalid")).to.equal(false);

    element.value = "";
    await nextMicrotask();
    element.reportValidity();
    expect(element.hasAttribute("invalid")).to.equal(true);
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
    expect(element.internals.ariaInvalid).to.equal("false");
    expect(element.hasAttribute("invalid")).to.equal(false);
    expect(element.internals.ariaLabel).to.equal("Forest name");

    element.value = "Pine";
    element.disabled = true;
    await nextMicrotask();

    expect(element.internals.ariaInvalid).to.equal("false");
    expect(element.internals.ariaDisabled).to.equal("true");
  });
});
