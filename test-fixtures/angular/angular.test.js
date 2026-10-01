import { expect } from "@esm-bundle/chai";
import "@angular/compiler";
import { Component, CUSTOM_ELEMENTS_SCHEMA, provideZonelessChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import "../../src/button/button.js";
import "../../src/checkbox/checkbox.js";
import "../../src/table/table.js";

const nextTask = () => Promise.resolve();

function createFixtureComponent(state) {
  class FixtureComponent {
    config = state.config;
    checked = false;

    onCheckboxChange(event) {
      state.changeCount += 1;
      this.checked = event.detail.checked;
    }

    onButtonClick() {
      state.clickCount += 1;
    }
  }

  Component({
    selector: "rowan-angular-fixture",
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
      <rowan-table [config]="config"></rowan-table>
      <form>
        <rowan-checkbox
          [checked]="checked"
          name="consent"
          value="yes"
          (rowan-change)="onCheckboxChange($event)"
        >Accept terms</rowan-checkbox>
        <rowan-button type="button" (rowan-click)="onButtonClick()">Save</rowan-button>
      </form>
    `,
  })(FixtureComponent);

  return FixtureComponent;
}

describe("Angular compatibility", () => {
  let application = null;

  afterEach(() => {
    application?.destroy();
    application = null;
    document.body.innerHTML = "";
  });

  it("assigns structured properties and handles Rowan events through template bindings", async () => {
    const state = {
      config: {
        columns: [{ id: "name", header: "Name" }],
        rows: [{ id: "1", name: "Ada" }],
      },
      changeCount: 0,
      clickCount: 0,
    };
    const host = document.createElement("rowan-angular-fixture");
    document.body.append(host);

    application = await bootstrapApplication(createFixtureComponent(state), {
      providers: [provideZonelessChangeDetection()],
    });
    await nextTask();

    const table = host.querySelector("rowan-table");
    const form = host.querySelector("form");
    const checkbox = form.querySelector("rowan-checkbox");
    const button = form.querySelector("rowan-button");

    checkbox.shadowRoot.querySelector('input[type="checkbox"]').click();
    button.shadowRoot.querySelector("button").click();
    await nextTask();

    expect(table.config.rows).to.deep.equal(state.config.rows);
    expect(state.changeCount).to.equal(1);
    expect(checkbox.checked).to.equal(true);
    expect(new FormData(form).get("consent")).to.equal("yes");
    expect(state.clickCount).to.equal(1);
  });
});
