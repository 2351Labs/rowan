import { expect } from "@esm-bundle/chai";
import { createApp, h, nextTick, ref } from "vue";
import "../../src/button/button.js";
import "../../src/checkbox/checkbox.js";
import "../../src/table/table.js";

const nextTask = () => Promise.resolve();

describe("Vue compatibility", () => {
  let app = null;

  afterEach(() => {
    app?.unmount();
    app = null;
    document.body.innerHTML = "";
  });

  it("assigns structured properties and handles Rowan events through native bindings", async () => {
    const config = {
      columns: [{ id: "name", header: "Name" }],
      rows: [{ id: "1", name: "Ada" }],
    };
    const checked = ref(false);
    let changeCount = 0;
    let clickCount = 0;
    const container = document.createElement("div");
    document.body.append(container);

    app = createApp({
      setup() {
        return () =>
          h("div", [
            h("rowan-table", { config }),
            h("form", [
              h(
                "rowan-checkbox",
                {
                  checked: checked.value,
                  name: "consent",
                  value: "yes",
                  onRowanChange: (event) => {
                    changeCount += 1;
                    checked.value = event.detail.checked;
                  },
                },
                "Accept terms",
              ),
              h("rowan-button", { type: "button", onRowanClick: () => (clickCount += 1) }, "Save"),
            ]),
          ]);
      },
    });
    app.mount(container);
    await nextTick();
    await nextTask();

    const table = container.querySelector("rowan-table");
    const form = container.querySelector("form");
    const checkbox = form.querySelector("rowan-checkbox");
    const button = form.querySelector("rowan-button");

    checkbox.shadowRoot.querySelector('input[type="checkbox"]').click();
    button.shadowRoot.querySelector("button").click();
    await nextTick();

    expect(table.config.rows).to.deep.equal(config.rows);
    expect(changeCount).to.equal(1);
    expect(checkbox.checked).to.equal(true);
    expect(new FormData(form).get("consent")).to.equal("yes");
    expect(clickCount).to.equal(1);
  });
});
