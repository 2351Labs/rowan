import { expect } from "@esm-bundle/chai";

import "../../src/table/table.js";
import { ControlledTableDraftEditor } from "./controlled-draft-editor.js";

function nextMicrotask() {
  return new Promise((resolve) => queueMicrotask(resolve));
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
}

async function settle() {
  await nextMicrotask();
  await nextMicrotask();
  await nextMicrotask();
}

function configureTable(table, editor, rows) {
  table.config = {
    rowId: "id",
    columns: [
      {
        id: "name",
        header: "Name",
        type: "custom",
        cell: {
          interactive: true,
          render: (context) => editor.renderCell(context),
        },
      },
    ],
    rows,
  };
}

function fieldInput(table) {
  const field = table.shadowRoot.querySelector("rowan-text-field");
  return field?.shadowRoot?.querySelector("input") ?? null;
}

describe("ControlledTableDraftEditor prototype", () => {
  it("starts from the keyboard, cancels with Escape, and requests a controlled commit", async () => {
    const rows = [{ id: "member-1", name: "Ada" }];
    const commits = [];
    const table = document.createElement("rowan-table");
    const editor = new ControlledTableDraftEditor(table, {
      onCommit: (detail) => commits.push(detail),
    });
    configureTable(table, editor, rows);
    document.body.append(table);
    await settle();

    const trigger = table.shadowRoot.querySelector(".rowan-table-draft-trigger");
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        composed: true,
        key: "Enter",
      }),
    );
    await settle();

    let input = fieldInput(table);
    expect(input).to.not.equal(null);
    input.value = "Grace";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        composed: true,
        key: "Escape",
      }),
    );
    await settle();

    expect(rows[0].name).to.equal("Ada");
    expect(table.rows[0]).to.equal(rows[0]);
    expect(table.shadowRoot.querySelector(".rowan-table-draft-trigger").textContent).to.equal(
      "Ada",
    );

    table.shadowRoot.querySelector(".rowan-table-draft-trigger").click();
    await settle();

    input = fieldInput(table);
    input.value = "Grace";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        composed: true,
        key: "Enter",
      }),
    );
    await settle();

    expect(commits).to.deep.equal([
      {
        rowId: "member-1",
        columnId: "name",
        value: "Grace",
        previousValue: "Ada",
        row: rows[0],
      },
    ]);
    expect(rows[0].name).to.equal("Ada");
    expect(table.shadowRoot.querySelector(".rowan-table-draft-trigger").textContent).to.equal(
      "Ada",
    );

    editor.dispose();
    table.remove();
  });

  it("keeps a validation or save error visible and retains the draft for retry", async () => {
    const rows = [{ id: "member-1", name: "Ada" }];
    const commits = [];
    let attempts = 0;
    const table = document.createElement("rowan-table");
    const editor = new ControlledTableDraftEditor(table, {
      validate: ({ value }) => (value === "Taken" ? "A member already uses that name." : undefined),
      onCommit: (detail) => {
        attempts += 1;
        if (attempts === 1) throw new Error("Save is temporarily unavailable.");
        commits.push(detail);
      },
    });
    configureTable(table, editor, rows);
    document.body.append(table);
    await settle();

    table.shadowRoot.querySelector(".rowan-table-draft-trigger").click();
    await settle();

    let input = fieldInput(table);
    input.value = "Taken";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        composed: true,
        key: "Enter",
      }),
    );
    await settle();

    expect(table.shadowRoot.querySelector("[data-rowan-table-draft-error]").textContent).to.equal(
      "A member already uses that name.",
    );
    expect(fieldInput(table).value).to.equal("Taken");
    expect(rows[0].name).to.equal("Ada");

    input = fieldInput(table);
    input.value = "Grace";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        composed: true,
        key: "Enter",
      }),
    );
    await settle();

    expect(table.shadowRoot.querySelector("[data-rowan-table-draft-error]").textContent).to.equal(
      "Save is temporarily unavailable.",
    );
    expect(fieldInput(table).value).to.equal("Grace");
    expect(rows[0].name).to.equal("Ada");

    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        composed: true,
        key: "Enter",
      }),
    );
    await settle();

    expect(commits).to.deep.equal([
      {
        rowId: "member-1",
        columnId: "name",
        value: "Grace",
        previousValue: "Ada",
        row: rows[0],
      },
    ]);
    expect(rows[0].name).to.equal("Ada");

    editor.dispose();
    table.remove();
  });

  it("preserves an external draft across virtual row unmounting and blocks a replaced row", async () => {
    const rows = Array.from({ length: 40 }, (_value, index) => ({
      id: `member-${index + 1}`,
      name: `Member ${index + 1}`,
    }));
    const commits = [];
    const table = document.createElement("rowan-table");
    table.style.setProperty("--rowan-table-virtual-height", "60px");
    const editor = new ControlledTableDraftEditor(table, {
      onCommit: (detail) => commits.push(detail),
    });
    configureTable(table, editor, rows);
    table.virtualized = true;
    table.virtualItemSize = 20;
    table.virtualOverscan = 1;
    document.body.append(table);
    await settle();
    await nextFrame();
    await settle();

    table.shadowRoot.querySelector(".rowan-table-draft-trigger").click();
    await settle();

    let input = fieldInput(table);
    input.value = "Local draft";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));

    const viewport = table.shadowRoot.querySelector(".table-scroll");
    viewport.scrollTop = 500;
    viewport.dispatchEvent(new Event("scroll"));
    await settle();

    expect(table.shadowRoot.querySelector('tr[data-row-id="member-1"]')).to.equal(null);
    expect(rows[0].name).to.equal("Member 1");

    viewport.scrollTop = 0;
    viewport.dispatchEvent(new Event("scroll"));
    await settle();

    input = fieldInput(table);
    expect(input).to.not.equal(null);
    expect(input.value).to.equal("Local draft");

    const replacement = { id: "member-1", name: "Persisted replacement" };
    table.rows = [replacement, ...rows.slice(1)];
    await settle();

    expect(table.shadowRoot.querySelector("[data-rowan-table-draft-error]").textContent).to.equal(
      "The source row changed while this draft was open. Cancel and restart editing.",
    );
    input = fieldInput(table);
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        composed: true,
        key: "Enter",
      }),
    );
    await settle();

    expect(commits).to.deep.equal([]);
    expect(replacement.name).to.equal("Persisted replacement");
    expect(rows[0].name).to.equal("Member 1");

    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        composed: true,
        key: "Escape",
      }),
    );
    await settle();

    expect(table.shadowRoot.querySelector(".rowan-table-draft-trigger").textContent).to.equal(
      "Persisted replacement",
    );

    editor.dispose();
    table.remove();
  });

  it("blocks a commit when the host changes the edited value in place", async () => {
    const rows = [{ id: "member-1", name: "Ada" }];
    const commits = [];
    const table = document.createElement("rowan-table");
    const editor = new ControlledTableDraftEditor(table, {
      onCommit: (detail) => commits.push(detail),
    });
    configureTable(table, editor, rows);
    document.body.append(table);
    await settle();

    table.shadowRoot.querySelector(".rowan-table-draft-trigger").click();
    await settle();

    const input = fieldInput(table);
    input.value = "Local draft";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));

    rows[0].name = "Persisted update";
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        composed: true,
        key: "Enter",
      }),
    );
    await settle();

    expect(commits).to.deep.equal([]);
    expect(rows[0].name).to.equal("Persisted update");
    expect(table.shadowRoot.querySelector("[data-rowan-table-draft-error]").textContent).to.equal(
      "The source row changed while this draft was open. Cancel and restart editing.",
    );

    editor.dispose();
    table.remove();
  });

  it("blocks a commit when the host changes the source during async validation", async () => {
    const rows = [{ id: "member-1", name: "Ada" }];
    const commits = [];
    const validation = deferred();
    const table = document.createElement("rowan-table");
    const editor = new ControlledTableDraftEditor(table, {
      validate: () => validation.promise,
      onCommit: (detail) => commits.push(detail),
    });
    configureTable(table, editor, rows);
    document.body.append(table);
    await settle();

    table.shadowRoot.querySelector(".rowan-table-draft-trigger").click();
    await settle();

    const input = fieldInput(table);
    input.value = "Local draft";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        composed: true,
        key: "Enter",
      }),
    );
    await settle();

    rows[0].name = "Persisted update";
    validation.resolve();
    await settle();

    expect(commits).to.deep.equal([]);
    expect(rows[0].name).to.equal("Persisted update");
    expect(table.shadowRoot.querySelector("[data-rowan-table-draft-error]").textContent).to.equal(
      "The source row changed while this draft was open. Cancel and restart editing.",
    );

    editor.dispose();
    table.remove();
  });

  it("reports a stale source when async validation rejects after a host update", async () => {
    const rows = [{ id: "member-1", name: "Ada" }];
    const commits = [];
    const validation = deferred();
    const table = document.createElement("rowan-table");
    const editor = new ControlledTableDraftEditor(table, {
      validate: () => validation.promise,
      onCommit: (detail) => commits.push(detail),
    });
    configureTable(table, editor, rows);
    document.body.append(table);
    await settle();

    table.shadowRoot.querySelector(".rowan-table-draft-trigger").click();
    await settle();

    const input = fieldInput(table);
    input.value = "Local draft";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        composed: true,
        key: "Enter",
      }),
    );
    await settle();

    rows[0].name = "Persisted update";
    validation.reject(new Error("The value could not be validated."));
    await settle();

    expect(commits).to.deep.equal([]);
    expect(rows[0].name).to.equal("Persisted update");
    expect(table.shadowRoot.querySelector("[data-rowan-table-draft-error]").textContent).to.equal(
      "The source row changed while this draft was open. Cancel and restart editing.",
    );

    editor.dispose();
    table.remove();
  });

  it("reports a stale source when validation throws after a host update", async () => {
    const rows = [{ id: "member-1", name: "Ada" }];
    const commits = [];
    const table = document.createElement("rowan-table");
    const editor = new ControlledTableDraftEditor(table, {
      validate: () => {
        rows[0].name = "Persisted update";
        throw new Error("The value could not be validated.");
      },
      onCommit: (detail) => commits.push(detail),
    });
    configureTable(table, editor, rows);
    document.body.append(table);
    await settle();

    table.shadowRoot.querySelector(".rowan-table-draft-trigger").click();
    await settle();

    const input = fieldInput(table);
    input.value = "Local draft";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        composed: true,
        key: "Enter",
      }),
    );
    await settle();

    expect(commits).to.deep.equal([]);
    expect(rows[0].name).to.equal("Persisted update");
    expect(table.shadowRoot.querySelector("[data-rowan-table-draft-error]").textContent).to.equal(
      "The source row changed while this draft was open. Cancel and restart editing.",
    );

    editor.dispose();
    table.remove();
  });
});
