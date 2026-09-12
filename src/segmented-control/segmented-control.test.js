import { expect } from "@esm-bundle/chai";
import "./segmented-control.js";

const nextMicrotask = () => Promise.resolve();

const OPTIONS = [
  { value: "board", label: "Board" },
  { value: "list", label: "List", disabled: true },
  { value: "timeline", label: "Timeline" },
];

async function renderControl({ value = "board", required = false } = {}) {
  const control = document.createElement("rowan-segmented-control");
  control.label = "View mode";
  control.options = OPTIONS;
  control.value = value;
  control.required = required;
  document.body.append(control);
  await nextMicrotask();
  await nextMicrotask();
  return control;
}

describe("rowan-segmented-control", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders property-only modes and reflects the selected scalar value", async () => {
    const control = await renderControl();

    expect(control.shadowRoot.querySelectorAll("button[data-value]")).to.have.length(3);
    expect(control.getAttribute("value")).to.equal("board");
    expect(control.hasAttribute("options")).to.equal(false);
    expect(control.shadowRoot.querySelector("button[aria-checked='true']").textContent).to.equal(
      "Board",
    );
  });

  it("keeps parent-driven value changes silent and emits one composed change for user activation", async () => {
    const control = await renderControl();
    const changes = [];
    control.addEventListener("rowan-change", (event) => changes.push(event));

    control.value = "timeline";
    await nextMicrotask();
    expect(changes).to.have.length(0);

    control.shadowRoot.querySelector("button[data-value='board']").click();
    await nextMicrotask();

    expect(control.value).to.equal("board");
    expect(changes).to.have.length(1);
    expect(changes[0].detail.value).to.equal("board");
    expect(changes[0].bubbles).to.equal(true);
    expect(changes[0].composed).to.equal(true);
  });

  it("selects and focuses the next enabled mode with Arrow keys", async () => {
    const control = await renderControl();
    const board = control.shadowRoot.querySelector("button[data-value='board']");
    board.focus();
    board.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "ArrowRight" }),
    );
    await nextMicrotask();
    await nextMicrotask();

    const timeline = control.shadowRoot.querySelector("button[data-value='timeline']");
    expect(control.value).to.equal("timeline");
    expect(control.shadowRoot.activeElement === timeline).to.equal(true);
    expect(timeline.tabIndex).to.equal(0);
  });

  it("submits with FACE, resets its default, and applies required validity", async () => {
    const form = document.createElement("form");
    const control = document.createElement("rowan-segmented-control");
    control.name = "view";
    control.options = OPTIONS;
    control.value = "board";
    form.append(control);
    document.body.append(form);
    await nextMicrotask();
    await nextMicrotask();

    expect(new FormData(form).get("view")).to.equal("board");

    control.value = "timeline";
    form.reset();
    await nextMicrotask();
    expect(control.value).to.equal("board");

    control.required = true;
    control.value = "";
    await nextMicrotask();
    expect(control.checkValidity()).to.equal(false);
  });

  it("supplies radiogroup semantics without replacing author ARIA", async () => {
    const control = await renderControl();
    control.setAttribute("aria-label", "Workspace view");
    await nextMicrotask();

    expect(control.internals.role).to.equal("radiogroup");
    expect(control.getAttribute("aria-label")).to.equal("Workspace view");
    expect(control.internals.ariaLabel).to.equal("View mode");
  });
});
