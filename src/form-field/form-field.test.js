import { expect } from "@esm-bundle/chai";
import "../text-field/text-field.js";
import "./form-field.js";

const nextMicrotask = () => Promise.resolve();

describe("rowan-form-field", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders attribute-based label and support content", async () => {
    const element = document.createElement("rowan-form-field");
    element.label = "Workspace name";
    element.hint = "Used in workspace URLs.";
    element.description = "Choose a concise, recognizable name.";
    element.error = "A workspace name is required.";
    document.body.append(element);
    await nextMicrotask();

    expect(element.shadowRoot.querySelector('[part="label"]').textContent).to.equal(
      "Workspace name",
    );
    expect(element.shadowRoot.querySelector('[part="hint"]').textContent).to.equal(
      "Used in workspace URLs.",
    );
    expect(element.shadowRoot.querySelector('[part="description"]').textContent).to.equal(
      "Choose a concise, recognizable name.",
    );
    expect(element.shadowRoot.querySelector('[part="error"]').textContent).to.equal(
      "A workspace name is required.",
    );
  });

  it("connects its label and support text to a direct custom control", async () => {
    const field = document.createElement("rowan-form-field");
    const control = document.createElement("rowan-text-field");
    field.label = "Workspace name";
    field.hint = "Used in workspace URLs.";
    field.description = "Choose a concise, recognizable name.";
    field.append(control);
    document.body.append(field);
    await nextMicrotask();

    const label = field.shadowRoot.querySelector('[part="label"]');
    const hint = field.shadowRoot.querySelector('[part="hint"]');
    const description = field.shadowRoot.querySelector('[part="description"]');

    expect(control.getAttribute("aria-labelledby")).to.equal(label.id);
    expect(tokens(control.getAttribute("aria-describedby"))).to.deep.equal([
      hint.id,
      description.id,
    ]);
  });

  it("preserves author-provided accessibility references", async () => {
    const field = document.createElement("rowan-form-field");
    const control = document.createElement("input");
    control.setAttribute("aria-describedby", "existing-help");
    field.hint = "Shown below the field.";
    field.append(control);
    document.body.append(field);
    await nextMicrotask();

    const hint = field.shadowRoot.querySelector('[part="hint"]');
    expect(tokens(control.getAttribute("aria-describedby"))).to.deep.equal([
      "existing-help",
      hint.id,
    ]);

    field.remove();
    expect(control.getAttribute("aria-describedby")).to.equal("existing-help");
  });

  it("can associate an external control through its for attribute", async () => {
    const control = document.createElement("input");
    control.id = "workspace-name";
    const field = document.createElement("rowan-form-field");
    field.htmlFor = control.id;
    field.label = "Workspace name";
    document.body.append(control, field);
    await nextMicrotask();

    field.shadowRoot.querySelector('[part="label"]').click();

    expect(control.getAttribute("aria-labelledby")).to.equal(
      field.shadowRoot.querySelector('[part="label"]').id,
    );
    expect(document.activeElement).to.equal(control);
  });

  it("surfaces a slotted control invalid state and required indicator", async () => {
    const field = document.createElement("rowan-form-field");
    const control = document.createElement("rowan-text-field");
    field.label = "Workspace name";
    control.required = true;
    field.append(control);
    document.body.append(field);
    await nextMicrotask();

    expect(field.shadowRoot.querySelector('[part="required-indicator"]').hidden).to.equal(false);

    control.invalid = true;
    await nextMicrotask();
    await nextMicrotask();

    expect(field.shadowRoot.querySelector('[part="field"]').classList.contains("is-invalid")).to.equal(
      true,
    );
  });
});

function tokens(value) {
  return String(value ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}