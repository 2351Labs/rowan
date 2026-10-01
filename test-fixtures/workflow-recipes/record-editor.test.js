import { expect } from "@esm-bundle/chai";

import { createRecordEditor } from "../../documentation/workflows/record-editor.js";

const nextMicrotask = () => Promise.resolve();

async function settle() {
  await nextMicrotask();
  await nextMicrotask();
  await nextMicrotask();
  await nextMicrotask();
}

function clickRowanButton(button) {
  const nativeButton = button?.shadowRoot?.querySelector("button");
  expect(nativeButton).to.not.equal(null);
  nativeButton.click();
}

function changeField(field, value) {
  field.value = value;
  field.dispatchEvent(
    new CustomEvent("rowan-change", {
      bubbles: true,
      composed: true,
      detail: { value },
    }),
  );
}

describe("record editor documentation workflow", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  for (const viewport of [
    { name: "desktop", inlineSize: "72rem" },
    { name: "mobile", inlineSize: "22rem" },
  ]) {
    it(`keeps validation, persistence, and routing application-owned at ${viewport.name} size`, async () => {
      const saves = [];
      const routes = [];
      let resolveSave;
      const saved = new Promise((resolve) => {
        resolveSave = resolve;
      });
      const editor = createRecordEditor({
        onSave: (detail) => {
          saves.push(detail);
          return saved;
        },
        onRoute: (detail) => routes.push(detail),
      });
      editor.style.inlineSize = viewport.inlineSize;
      document.body.append(editor);
      await settle();

      const form = editor.querySelector("form");
      const validationSummary = editor.querySelector("rowan-validation-summary");
      const name = editor.querySelector('[name="name"]');
      const save = [...editor.querySelectorAll("rowan-button")].find(
        (button) => button.textContent === "Save changes",
      );
      const back = [...editor.querySelectorAll("rowan-button")].find(
        (button) => button.textContent === "Back to resources",
      );
      const discardDialog = editor.querySelector("rowan-confirm-dialog");

      expect(form).to.not.equal(null);
      expect(validationSummary).to.not.equal(null);
      expect(name).to.not.equal(null);
      expect(save).to.not.equal(undefined);
      expect(back).to.not.equal(undefined);
      expect(discardDialog).to.not.equal(null);

      changeField(name, "");
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      await settle();
      expect(validationSummary.errors.map((error) => error.fieldId)).to.deep.equal([name.id]);
      expect(saves).to.deep.equal([]);

      changeField(name, "Partner delivery webhook v2");
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      await settle();
      expect(saves).to.deep.equal([
        {
          record: {
            name: "Partner delivery webhook v2",
            owner: "Integrations",
            status: "Review",
            description: "Routes delivery updates to the partner operations workspace.",
          },
        },
      ]);
      expect(save.loading).to.equal(true);
      expect(back.disabled).to.equal(true);

      resolveSave();
      await settle();
      expect(save.loading).to.equal(false);
      expect(editor.querySelector(".workflow-recipe-summary").textContent).to.equal(
        "Changes saved.",
      );

      changeField(name, "Partner delivery webhook v3");
      clickRowanButton(back);
      await settle();
      expect(discardDialog.open).to.equal(true);
      expect(routes).to.deep.equal([]);

      clickRowanButton(discardDialog.shadowRoot.querySelector(".confirm"));
      await settle();
      expect(discardDialog.open).to.equal(false);
      expect(name.value).to.equal("Partner delivery webhook v2");
      expect(routes).to.deep.equal([
        {
          type: "back",
          record: {
            name: "Partner delivery webhook v2",
            owner: "Integrations",
            status: "Review",
            description: "Routes delivery updates to the partner operations workspace.",
          },
        },
      ]);
    });
  }
});
