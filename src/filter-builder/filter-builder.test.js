import { expect } from "@esm-bundle/chai";

import "../table/table.js";
import "./filter-builder.js";

const nextMicrotask = () => Promise.resolve();

async function settle() {
  await nextMicrotask();
  await nextMicrotask();
  await nextMicrotask();
}

function changeValue(control, value) {
  control.value = value;
  control.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
}

describe("rowan-filter-builder", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("emits copied filter state only for user add, update, and clear actions", async () => {
    const builder = document.createElement("rowan-filter-builder");
    builder.fields = [
      { id: "name", label: "Name" },
      {
        id: "role",
        label: "Role",
        options: ["Admin", "Editor"],
      },
    ];
    builder.filters = [{ id: "role-filter", field: "role", operator: "equals", value: "Editor" }];

    const events = [];
    builder.addEventListener("rowan-filter-change", (event) => {
      events.push(event.detail);
    });

    document.body.append(builder);
    await settle();

    expect(events).to.deep.equal([]);
    expect(builder.internals.role).to.equal("group");

    const valueSelect = builder.shadowRoot.querySelector('[data-filter-part="value"]');
    changeValue(valueSelect, "Admin");
    await settle();

    expect(events).to.have.length(1);
    expect(events[0].action).to.equal("update");
    expect(events[0].filters).to.deep.equal([
      { id: "role-filter", field: "role", operator: "equals", value: "Admin" },
    ]);

    builder.shadowRoot.querySelector('[data-action="add"]').click();
    await settle();

    expect(events).to.have.length(2);
    expect(events[1].action).to.equal("add");
    expect(events[1].filters).to.have.length(2);

    builder.shadowRoot.querySelector('[data-action="clear"]').click();
    await settle();

    expect(events).to.have.length(3);
    expect(events[2]).to.deep.include({ action: "clear", filter: null });
    expect(events[2].filters).to.deep.equal([]);
  });

  it("infers filterable fields from a referenced table and keeps parent updates silent", async () => {
    const table = document.createElement("rowan-table");
    table.id = "members-table";
    table.config = {
      columns: [
        { id: "name", header: "Name", type: "text" },
        { id: "active", header: "Active", type: "switch" },
        { id: "edit", header: "Edit", type: "button" },
      ],
      rows: [{ id: "1", name: "Ada", active: true }],
    };

    const builder = document.createElement("rowan-filter-builder");
    builder.forTable = "members-table";
    let eventCount = 0;
    builder.addEventListener("rowan-filter-change", () => {
      eventCount += 1;
    });

    document.body.append(table, builder);
    await settle();

    const fieldOptions = Array.from(
      builder.shadowRoot
        .querySelector('[data-action="add"]')
        .parentElement.parentElement.querySelectorAll("option"),
    ).map((option) => option.value);

    expect(builder.table).to.equal(table);
    expect(fieldOptions).to.deep.equal([]);

    builder.shadowRoot.querySelector('[data-action="add"]').click();
    await settle();

    const fieldSelect = builder.shadowRoot.querySelector('[data-filter-part="field"]');
    expect(Array.from(fieldSelect.options).map((option) => option.value)).to.deep.equal([
      "name",
      "active",
    ]);
    expect(builder.filters).to.have.length(1);
    expect(eventCount).to.equal(1);

    builder.filters = [{ id: "parent-filter", field: "name", operator: "contains", value: "Ada" }];
    await settle();

    expect(eventCount).to.equal(1);
    expect(builder.filters).to.deep.equal([
      { id: "parent-filter", field: "name", operator: "contains", value: "Ada" },
    ]);
  });

  it("binds a declarative table reference that becomes available later", async () => {
    const builder = document.createElement("rowan-filter-builder");
    builder.forTable = "late-members-table";

    document.body.append(builder);
    await settle();

    expect(builder.table).to.equal(null);

    const table = document.createElement("rowan-table");
    table.id = "late-members-table";
    table.config = {
      columns: [{ id: "active", header: "Active", type: "switch" }],
      rows: [{ id: "1", active: false }],
    };
    document.body.append(table);
    await settle();

    const filter = builder.addFilter({ field: "active" });
    await settle();

    expect(builder.table).to.equal(table);
    expect(filter).to.deep.equal({
      id: "filter-1",
      field: "active",
      operator: "equals",
      value: "true",
    });
    expect(builder.filters).to.deep.equal([filter]);
    expect(builder.shadowRoot.querySelector('[data-filter-part="value"]').value).to.equal("true");
  });

  it("clears an existing value when a user chooses a valueless operator", async () => {
    const builder = document.createElement("rowan-filter-builder");
    builder.fields = [{ id: "name", label: "Name" }];
    builder.filters = [{ id: "name-filter", field: "name", operator: "contains", value: "Ada" }];
    document.body.append(builder);
    await settle();

    const changes = [];
    builder.addEventListener("rowan-filter-change", (event) => changes.push(event.detail));

    changeValue(builder.shadowRoot.querySelector('[data-filter-part="operator"]'), "is-empty");
    await settle();

    expect(builder.filters).to.deep.equal([
      { id: "name-filter", field: "name", operator: "is-empty", value: "" },
    ]);
    expect(builder.shadowRoot.querySelector('[part="value-control"]').textContent).to.equal(
      "No value",
    );
    expect(changes).to.deep.equal([
      {
        action: "update",
        filter: { id: "name-filter", field: "name", operator: "is-empty", value: "" },
        filters: [{ id: "name-filter", field: "name", operator: "is-empty", value: "" }],
      },
    ]);
  });
});
