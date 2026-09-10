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
  });

  it("shows empty state when no errors", async () => {
    const element = document.createElement("rowan-validation-summary");
    document.body.append(element);
    await nextMicrotask();

    const empty = element.shadowRoot.querySelector('[data-part="empty"]');
    expect(empty).to.not.equal(null);
    expect(empty.hidden).to.equal(false);
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
});