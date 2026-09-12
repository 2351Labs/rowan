import { expect } from "@esm-bundle/chai";
import "./listbox.js";

const nextMicrotask = () => Promise.resolve();

async function renderListbox({ selection = "single", required = false } = {}) {
  const listbox = document.createElement("rowan-listbox");
  const design = document.createElement("rowan-option");
  const engineering = document.createElement("rowan-option");
  const operations = document.createElement("rowan-option");

  listbox.selection = selection;
  listbox.required = required;
  listbox.label = "Teams";
  design.value = "design";
  design.textContent = "Design";
  engineering.value = "engineering";
  engineering.textContent = "Engineering";
  operations.value = "operations";
  operations.textContent = "Operations";
  listbox.append(design, engineering, operations);
  document.body.append(listbox);
  await nextMicrotask();
  await nextMicrotask();

  return { listbox, design, engineering, operations };
}

function keydown(option, key, options = {}) {
  option.dispatchEvent(
    new KeyboardEvent("keydown", { bubbles: true, composed: true, key, ...options }),
  );
}

describe("rowan-listbox", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("keeps property-driven selection silent and emits a composed change for user selection", async () => {
    const { listbox, design, engineering } = await renderListbox();
    let detail = null;
    let eventMeta = null;

    listbox.addEventListener("rowan-change", (event) => {
      detail = event.detail;
      eventMeta = { bubbles: event.bubbles, composed: event.composed };
    });

    listbox.selected = ["engineering"];
    await nextMicrotask();

    expect(listbox.selected).to.deep.equal(["engineering"]);
    expect(engineering.selected).to.equal(true);
    expect(detail).to.equal(null);

    design.click();

    expect(detail.value).to.equal("design");
    expect(detail.selected).to.deep.equal(["design"]);
    expect(detail.option).to.equal(design);
    expect(eventMeta).to.deep.equal({ bubbles: true, composed: true });
  });

  it("moves roving focus with the Arrow keys and skips disabled options", async () => {
    const { design, engineering, operations } = await renderListbox();
    engineering.disabled = true;
    await nextMicrotask();

    expect(design.tabIndex).to.equal(0);
    expect(engineering.tabIndex).to.equal(-1);
    expect(operations.tabIndex).to.equal(-1);

    design.focus();
    keydown(design, "ArrowDown");

    expect(document.activeElement).to.equal(operations);
    expect(design.tabIndex).to.equal(-1);
    expect(operations.tabIndex).to.equal(0);

    keydown(operations, "Home");
    expect(document.activeElement).to.equal(design);
  });

  it("supports multiple selection from the keyboard without an array attribute", async () => {
    const { listbox, design, engineering } = await renderListbox({ selection: "multiple" });
    const changes = [];
    listbox.addEventListener("rowan-change", (event) => changes.push(event.detail));

    keydown(design, " ");
    keydown(engineering, " ");
    await nextMicrotask();

    expect(listbox.selected).to.deep.equal(["design", "engineering"]);
    expect(listbox.hasAttribute("selected")).to.equal(false);
    expect(changes).to.have.length(2);
  });

  it("submits multiple selected values through FACE and restores its default state", async () => {
    const form = document.createElement("form");
    const listbox = document.createElement("rowan-listbox");
    const design = document.createElement("rowan-option");
    const engineering = document.createElement("rowan-option");

    listbox.name = "teams";
    listbox.selection = "multiple";
    design.value = "design";
    design.selected = true;
    engineering.value = "engineering";
    engineering.selected = true;
    listbox.append(design, engineering);
    form.append(listbox);
    document.body.append(form);
    await nextMicrotask();
    await nextMicrotask();

    expect(new FormData(form).getAll("teams")).to.deep.equal(["design", "engineering"]);

    listbox.clearSelection();
    form.reset();
    await nextMicrotask();

    expect(listbox.selected).to.deep.equal(["design", "engineering"]);
  });

  it("uses required validity and releases managed tab stops when options disconnect", async () => {
    const { listbox, design, engineering } = await renderListbox({ required: true });

    expect(listbox.internals.role).to.equal("listbox");
    expect(listbox.internals.ariaInvalid).to.equal("true");
    expect(listbox.checkValidity()).to.equal(false);

    engineering.remove();
    document.body.append(engineering);
    await nextMicrotask();
    await nextMicrotask();

    expect(engineering.hasAttribute("tabindex")).to.equal(false);
    design.click();
    await nextMicrotask();
    expect(listbox.checkValidity()).to.equal(true);
  });
});
