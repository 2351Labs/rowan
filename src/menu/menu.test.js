import { expect } from "@esm-bundle/chai";
import "./menu.js";
import "../menu-item/menu-item.js";

const nextMicrotask = () => Promise.resolve();

const settle = async () => {
  await nextMicrotask();
  await nextMicrotask();
};

function createItem(value, label, disabled = false) {
  const item = document.createElement("rowan-menu-item");
  item.value = value;
  item.textContent = label;
  item.disabled = disabled;
  return item;
}

function keydown(element, key) {
  element.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true, key }));
}

describe("rowan-menu", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("emits rowan-change when menu item is clicked", async () => {
    const menu = document.createElement("rowan-menu");
    const item = document.createElement("rowan-menu-item");
    item.value = "edit";
    item.textContent = "Edit";
    menu.append(item);
    document.body.append(menu);
    await nextMicrotask();

    let detail = null;
    menu.addEventListener("rowan-change", (event) => {
      detail = event.detail;
    });

    item.shadowRoot.querySelector("button").click();
    expect(detail.value).to.equal("edit");
  });

  it("keeps one selection listener after reconnecting", async () => {
    const menu = document.createElement("rowan-menu");
    const item = document.createElement("rowan-menu-item");
    item.value = "edit";
    item.textContent = "Edit";
    menu.append(item);
    document.body.append(menu);
    await nextMicrotask();

    let eventCount = 0;
    menu.addEventListener("rowan-change", () => {
      eventCount += 1;
    });

    menu.remove();
    document.body.append(menu);
    await nextMicrotask();

    item.shadowRoot.querySelector("button").click();
    expect(eventCount).to.equal(1);
  });

  it("uses a single roving tab stop and activates items from the keyboard", async () => {
    const menu = document.createElement("rowan-menu");
    const edit = createItem("edit", "Edit");
    const archive = createItem("archive", "Archive");
    const remove = createItem("remove", "Remove", true);
    menu.append(edit, archive, remove);
    document.body.append(menu);
    await settle();

    const editButton = edit.shadowRoot.querySelector("button");
    const archiveButton = archive.shadowRoot.querySelector("button");
    const removeButton = remove.shadowRoot.querySelector("button");
    expect(menu.internals.role).to.equal("menu");
    expect(menu.shadowRoot.querySelector(".menu").getAttribute("role")).to.equal("menu");
    expect(edit.internals.role).to.equal("menuitem");
    expect(editButton.getAttribute("role")).to.equal("menuitem");
    expect(editButton.tabIndex).to.equal(0);
    expect(archiveButton.tabIndex).to.equal(-1);
    expect(removeButton.tabIndex).to.equal(-1);

    editButton.focus();
    keydown(editButton, "ArrowDown");
    await settle();
    expect(archive.shadowRoot.activeElement).to.equal(archiveButton);

    keydown(archiveButton, "ArrowUp");
    await settle();
    expect(edit.shadowRoot.activeElement).to.equal(editButton);

    let detail = null;
    menu.addEventListener("rowan-change", (event) => {
      detail = event.detail;
    });
    keydown(editButton, " ");

    expect(detail).to.deep.equal({ value: "edit", item: edit });
  });

  it("reconciles roving focus when children become unavailable or are added", async () => {
    const menu = document.createElement("rowan-menu");
    const edit = createItem("edit", "Edit");
    const archive = createItem("archive", "Archive");
    menu.append(edit, archive);
    document.body.append(menu);
    await settle();

    edit.disabled = true;
    await settle();
    expect(archive.shadowRoot.querySelector("button").tabIndex).to.equal(0);

    archive.remove();
    const duplicate = createItem("duplicate", "Duplicate");
    menu.append(duplicate);
    await settle();

    expect(duplicate.shadowRoot.querySelector("button").tabIndex).to.equal(0);
  });
});
