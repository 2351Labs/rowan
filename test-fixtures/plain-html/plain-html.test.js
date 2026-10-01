import { expect } from "@esm-bundle/chai";
import "../../src/button/button.js";
import "../../src/checkbox/checkbox.js";
import "../../src/table/table.js";

const nextTask = () => Promise.resolve();

describe("Plain HTML compatibility", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("supports declarative markup, property assignment, composed events, and FACE submission", async () => {
    const form = document.createElement("form");
    form.innerHTML = `
      <rowan-table></rowan-table>
      <rowan-checkbox name="consent" value="yes">Accept terms</rowan-checkbox>
      <rowan-button type="button">Save</rowan-button>
    `;
    document.body.append(form);
    await nextTask();

    const table = form.querySelector("rowan-table");
    const checkbox = form.querySelector("rowan-checkbox");
    const button = form.querySelector("rowan-button");
    let receivedClick = false;

    form.addEventListener("rowan-click", (event) => {
      receivedClick = event.composed && event.target === button;
    });

    table.config = {
      columns: [{ id: "name", header: "Name" }],
      rows: [{ id: "1", name: "Ada" }],
    };
    checkbox.checked = true;
    button.shadowRoot.querySelector("button").click();

    expect(table.config.rows).to.deep.equal([{ id: "1", name: "Ada" }]);
    expect(checkbox.checked).to.equal(true);
    expect(new FormData(form).get("consent")).to.equal("yes");
    expect(receivedClick).to.equal(true);
  });
});
