import { expect } from "@esm-bundle/chai";
import "./validation-summary.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-validation-summary", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders errors from property", async () => {
    const element = document.createElement("rowan-validation-summary");
    element.errors = [
      { fieldId: "firstName", message: "First name is required" },
      { fieldId: "email", message: "Email is invalid" },
    ];
    document.body.append(element);
    await nextMicrotask();

    const items = element.shadowRoot.querySelectorAll('[data-part="error-button"]');
    expect(items.length).to.equal(2);
    expect(items[0].textContent).to.include("First name is required");
    expect(element.shadowRoot.querySelector(".list").hidden).to.equal(false);
    expect(element.shadowRoot.querySelector('[data-part="empty"]').hidden).to.equal(true);
  });

  it("shows empty state when no errors", async () => {
    const element = document.createElement("rowan-validation-summary");
    document.body.append(element);
    await nextMicrotask();

    const empty = element.shadowRoot.querySelector('[data-part="empty"]');
    const list = element.shadowRoot.querySelector(".list");
    expect(empty).to.not.equal(null);
    expect(empty.hidden).to.equal(false);
    expect(list.hidden).to.equal(true);
  });

  it("emits rowan-jump and focuses target field when user activates an error", async () => {
    const input = document.createElement("input");
    input.id = "email";

    const element = document.createElement("rowan-validation-summary");
    element.errors = [{ fieldId: "email", message: "Email is required" }];

    document.body.append(input, element);
    await nextMicrotask();

    let detail = null;
    let eventMeta = null;
    element.addEventListener("rowan-jump", (event) => {
      detail = event.detail;
      eventMeta = { bubbles: event.bubbles, composed: event.composed };
    });

    const button = element.shadowRoot.querySelector('[data-part="error-button"]');
    button.click();
    await nextMicrotask();

    expect(detail.fieldId).to.equal("email");
    expect(document.activeElement).to.equal(input);
    expect(eventMeta).to.deep.equal({ bubbles: true, composed: true });
  });

  it("does not emit rowan-jump when parent sets errors", async () => {
    const element = document.createElement("rowan-validation-summary");
    document.body.append(element);
    await nextMicrotask();

    let eventCount = 0;
    element.addEventListener("rowan-jump", () => {
      eventCount += 1;
    });

    element.errors = [{ fieldId: "name", message: "Name is required" }];
    await nextMicrotask();

    expect(eventCount).to.equal(0);
  });

  it("collects invalid fields from a form", async () => {
    const form = document.createElement("form");
    form.id = "signup";

    const label = document.createElement("label");
    label.htmlFor = "name";
    label.textContent = "Name";

    const input = document.createElement("input");
    input.id = "name";
    input.name = "name";
    input.required = true;

    form.append(label, input);

    const element = document.createElement("rowan-validation-summary");
    element.forForm = "signup";

    document.body.append(form, element);
    await nextMicrotask();

    const errors = element.collectFromForm();
    expect(errors.length).to.equal(1);
    expect(errors[0].fieldId).to.equal("name");
    expect(errors[0].label).to.equal("Name");
  });

  it("collects and focuses an invalid field without an id", async () => {
    const form = document.createElement("form");
    form.id = "signup";

    const label = document.createElement("label");
    label.textContent = "Email";
    const input = document.createElement("input");
    input.required = true;
    label.append(input);
    form.append(label);

    const element = document.createElement("rowan-validation-summary");
    element.forForm = "signup";
    document.body.append(form, element);
    await nextMicrotask();

    const errors = element.collectFromForm();
    await nextMicrotask();

    expect(errors).to.have.length(1);
    expect(errors[0].fieldId).to.match(/^rowan-validation-target-\d+$/);
    expect(errors[0].label).to.equal("Email");
    expect(input.id).to.equal("");

    element.shadowRoot.querySelector('[data-part="error-button"]').click();
    expect(document.activeElement).to.equal(input);
  });

  it("syncs host a11y defaults", async () => {
    const element = document.createElement("rowan-validation-summary");
    element.heading = "Please fix these fields";
    document.body.append(element);
    await nextMicrotask();

    expect(element.internals.role).to.equal("region");
    expect(element.internals.ariaLabel).to.equal("Please fix these fields");
    expect(element.internals.ariaDisabled).to.equal("false");

    element.disabled = true;
    await nextMicrotask();
    expect(element.internals.ariaDisabled).to.equal("true");
  });

  it("uses property-only messages for generated fallback errors and empty copy", async () => {
    const element = document.createElement("rowan-validation-summary");
    element.errors = [{ fieldId: "email" }, {}];
    document.body.append(element);
    await nextMicrotask();

    const events = [];
    element.addEventListener("rowan-jump", () => events.push(true));
    element.messages = {
      empty: "No hay problemas de validacion.",
      errorItem: "Error {index}: {message}",
      fieldInvalid: "{label} no es valido",
      heading: "Corrige los siguientes campos",
      unnamedField: "Campo {index}",
    };
    await nextMicrotask();

    const buttons = element.shadowRoot.querySelectorAll('[data-part="error-button"]');
    expect(element.getAttribute("messages")).to.equal(null);
    expect(element.shadowRoot.querySelector('[data-part="heading-text"]').textContent).to.equal(
      "Corrige los siguientes campos",
    );
    expect(buttons[0].textContent).to.equal("Error 1: email no es valido");
    expect(buttons[1].textContent).to.equal("Error 2: Campo 2 no es valido");
    expect(events).to.deep.equal([]);

    element.errors = [];
    await nextMicrotask();

    expect(element.shadowRoot.querySelector('[data-part="empty"]').textContent.trim()).to.equal(
      "No hay problemas de validacion.",
    );
    expect(events).to.deep.equal([]);
  });
});
