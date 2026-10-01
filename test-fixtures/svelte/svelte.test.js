import { expect } from "@esm-bundle/chai";
import { mount, unmount } from "svelte";
import "../../src/button/button.js";
import "../../src/checkbox/checkbox.js";
import "../../src/table/table.js";
import Fixture from "./Fixture.svelte";

const nextTask = () => Promise.resolve();

describe("Svelte compatibility", () => {
  let fixture = null;

  afterEach(() => {
    if (fixture) {
      unmount(fixture);
      fixture = null;
    }

    document.body.innerHTML = "";
  });

  it("assigns structured properties and handles Rowan events through native bindings", async () => {
    const config = {
      columns: [{ id: "name", header: "Name" }],
      rows: [{ id: "1", name: "Ada" }],
    };
    let changeCount = 0;
    let clickCount = 0;
    const container = document.createElement("div");
    document.body.append(container);

    fixture = mount(Fixture, {
      target: container,
      props: {
        config,
        onCheckboxChange: () => (changeCount += 1),
        onButtonClick: () => (clickCount += 1),
      },
    });
    await nextTask();

    const table = container.querySelector("rowan-table");
    const form = container.querySelector("form");
    const checkbox = form.querySelector("rowan-checkbox");
    const button = form.querySelector("rowan-button");

    checkbox.shadowRoot.querySelector('input[type="checkbox"]').click();
    button.shadowRoot.querySelector("button").click();
    await nextTask();

    expect(table.config.rows).to.deep.equal(config.rows);
    expect(changeCount).to.equal(1);
    expect(checkbox.checked).to.equal(true);
    expect(new FormData(form).get("consent")).to.equal("yes");
    expect(clickCount).to.equal(1);
  });
});
