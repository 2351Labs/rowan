import { expect } from "@esm-bundle/chai";
import "./context-menu.js";
import "../dialog/dialog.js";

const wait = () => Promise.resolve();
const settle = async () => {
  await wait();
  await wait();
  await wait();
};

function createMenu(target) {
  const menu = document.createElement("rowan-context-menu");
  menu.target = target;

  const edit = document.createElement("rowan-menu-item");
  edit.value = "edit";
  edit.textContent = "Edit";

  const archive = document.createElement("rowan-menu-item");
  archive.value = "archive";
  archive.textContent = "Archive";

  menu.append(edit, archive);
  return { menu, edit, archive };
}

describe("rowan-context-menu", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("opens from a target contextmenu event and suppresses the native menu", async () => {
    const target = document.createElement("button");
    const { menu } = createMenu(target);
    document.body.append(target, menu);
    await settle();

    const allowed = target.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 120,
        clientY: 80,
      }),
    );
    await settle();

    expect(allowed).to.equal(false);
    expect(menu.open).to.equal(true);
    expect(menu.shadowRoot.querySelector(".overlay").hidden).to.equal(false);
    expect(
      menu.shadowRoot.querySelector(".panel").style.getPropertyValue("--rowan-context-menu-x"),
    ).to.equal("120px");
  });

  it("opens from the keyboard and moves focus between enabled menu items", async () => {
    const target = document.createElement("button");
    const { menu, edit, archive } = createMenu(target);
    document.body.append(target, menu);
    await settle();

    target.focus();
    target.dispatchEvent(
      new KeyboardEvent("keydown", { key: "F10", shiftKey: true, bubbles: true, cancelable: true }),
    );
    await settle();

    expect(menu.open).to.equal(true);
    expect(edit.shadowRoot.activeElement).to.equal(edit.shadowRoot.querySelector("button"));

    edit.shadowRoot
      .querySelector("button")
      .dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, composed: true }),
      );
    await settle();

    expect(archive.shadowRoot.activeElement).to.equal(archive.shadowRoot.querySelector("button"));
  });

  it("emits one composed change event for a selected action and closes", async () => {
    const parent = document.createElement("div");
    const target = document.createElement("button");
    const { menu, edit } = createMenu(target);
    parent.append(target, menu);
    document.body.append(parent);
    await settle();

    let detail = null;
    parent.addEventListener("rowan-change", (event) => {
      detail = event.detail;
    });

    target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
    await settle();
    edit.shadowRoot.querySelector("button").click();
    await settle();

    expect(menu.open).to.equal(false);
    expect(detail).to.deep.equal({ value: "edit", item: edit });
  });

  it("activates a focused action once from Enter and Space", async () => {
    const parent = document.createElement("div");
    const target = document.createElement("button");
    const { menu, edit } = createMenu(target);
    parent.append(target, menu);
    document.body.append(parent);
    await settle();

    const changes = [];
    parent.addEventListener("rowan-change", (event) => changes.push(event.detail));

    for (const key of ["Enter", " "]) {
      target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
      await settle();
      edit.shadowRoot
        .querySelector("button")
        .dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true, key }));
      await settle();

      expect(menu.open).to.equal(false);
    }

    expect(changes).to.deep.equal([
      { value: "edit", item: edit },
      { value: "edit", item: edit },
    ]);
  });

  it("closes on Escape, returns focus, and emits a user close event", async () => {
    const target = document.createElement("button");
    const { menu, edit } = createMenu(target);
    document.body.append(target, menu);
    await settle();

    let reason = "";
    menu.addEventListener("rowan-close", (event) => {
      reason = event.detail.reason;
    });

    target.focus();
    target.dispatchEvent(new KeyboardEvent("keydown", { key: "ContextMenu", bubbles: true }));
    await settle();

    edit.shadowRoot
      .querySelector("button")
      .dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true }),
      );
    await settle();

    expect(menu.open).to.equal(false);
    expect(reason).to.equal("escape");
    expect(document.activeElement).to.equal(target);
  });

  it("closes on Tab so focus can leave", async () => {
    const target = document.createElement("button");
    const next = document.createElement("button");
    next.textContent = "Next";
    const { menu, edit } = createMenu(target);
    document.body.append(target, menu, next);
    await settle();

    target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
    await settle();
    expect(menu.open).to.equal(true);

    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    edit.shadowRoot.querySelector("button").dispatchEvent(event);
    await settle();

    expect(menu.open).to.equal(false);
    expect(event.defaultPrevented).to.equal(false);
  });

  it("does not close a parent dialog on the same Escape", async () => {
    const dialog = document.createElement("rowan-dialog");
    const target = document.createElement("button");
    target.textContent = "Row";
    const { menu, edit } = createMenu(target);
    dialog.append(target, menu);
    document.body.append(dialog);
    await settle();

    dialog.open = true;
    await settle();
    target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
    await settle();
    expect(menu.open).to.equal(true);

    edit.shadowRoot.querySelector("button").dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    await settle();

    expect(menu.open).to.equal(false);
    expect(dialog.open).to.equal(true);
  });
});
