import { expect } from "@esm-bundle/chai";

import "../filter-builder/filter-builder.js";
import "../table/table.js";
import {
  applyTableViewState,
  captureTableViewState,
  createLocalStorageSavedViewStorage,
  createMemorySavedViewStorage,
  createSavedViewStore,
  RowanSavedViews,
} from "./saved-views.js";
import "./saved-views.js";

const nextMicrotask = () => Promise.resolve();

async function settle() {
  await nextMicrotask();
  await nextMicrotask();
  await nextMicrotask();
}

function ordersTable() {
  const table = document.createElement("rowan-table");
  table.id = "orders";
  table.config = {
    caption: "Open orders",
    rowId: "id",
    density: "md",
    sort: { id: "updated", dir: "desc" },
    page: { index: 0, size: 25, total: 3 },
    columns: [
      { id: "order", header: "Order" },
      { id: "status", header: "Status" },
      { id: "owner", header: "Owner", hidden: true },
    ],
    rows: [
      { id: "SO-1042", order: "SO-1042", status: "Packed", owner: "Northwind" },
      { id: "SO-1048", order: "SO-1048", status: "Held", owner: "Contoso" },
      { id: "SO-1051", order: "SO-1051", status: "Shipped", owner: "Fabrikam" },
    ],
  };
  return table;
}

describe("saved view store", () => {
  it("saves, renames, defaults, and deletes named version 2 views", async () => {
    const storage = createMemorySavedViewStorage();
    const store = createSavedViewStore({ key: "orders", storage });
    const reasons = [];
    store.subscribe((detail) => reasons.push(detail.reason));

    const empty = await store.save({ name: "   ", state: {} });
    expect(empty.ok).to.equal(false);
    expect(empty.code).to.equal("empty-name");

    const saved = await store.save({
      name: "  Held orders  ",
      state: {
        version: 1,
        filters: [{ field: "status", operator: "equals", value: "Held" }],
        density: "sm",
      },
    });
    expect(saved.ok).to.equal(true);
    expect(saved.view.name).to.equal("Held orders");
    expect(saved.view.state.version).to.equal(2);
    expect(saved.view.state.filters).to.deep.equal([
      { field: "status", operator: "equals", value: "Held" },
    ]);

    const duplicate = await store.save({ name: "held orders", state: {} });
    expect(duplicate.code).to.equal("duplicate-name");

    const renamed = await store.rename(saved.view.id, "Blocked orders");
    expect(renamed.ok).to.equal(true);
    expect((await store.get(saved.view.id)).name).to.equal("Blocked orders");

    const marked = await store.setDefault(saved.view.id);
    expect(marked.view.isDefault).to.equal(true);
    await store.setDefault(null);
    expect((await store.list())[0].isDefault).to.equal(false);

    const removed = await store.delete(saved.view.id);
    expect(removed.ok).to.equal(true);
    expect(await store.list()).to.deep.equal([]);
    expect(reasons).to.deep.equal(["save", "rename", "default", "default", "delete"]);
  });

  it("keeps each storage key separate and drops a write that fails to persist", async () => {
    const storage = createMemorySavedViewStorage([
      {
        id: "view-seed",
        name: "Seed",
        isDefault: false,
        updatedAt: 1,
        state: { version: 2, density: "md" },
      },
    ]);
    const orders = createSavedViewStore({ key: "orders", storage });
    const plants = createSavedViewStore({ key: "plants", storage });
    await orders.save({ name: "Held orders", state: { density: "sm" } });
    expect((await plants.list()).map((view) => view.name)).to.deep.equal(["Seed"]);
    expect((await orders.list()).map((view) => view.name)).to.include("Held orders");

    let fail = true;
    const flaky = createSavedViewStore({
      key: "orders",
      storage: {
        load() {
          return [];
        },
        save() {
          if (fail) throw new Error("disk full");
        },
      },
    });
    let threw = false;
    try {
      await flaky.save({ name: "Held orders", state: {} });
    } catch {
      threw = true;
    }
    expect(threw).to.equal(true);
    expect(await flaky.list()).to.deep.equal([]);
    fail = false;
    expect((await flaky.save({ name: "Held orders", state: {} })).ok).to.equal(true);
  });

  it("keeps both saves when they overlap", async () => {
    const store = createSavedViewStore({
      key: "orders",
      storage: createMemorySavedViewStorage(),
    });
    const [first, second] = await Promise.all([
      store.save({ name: "Alpha", state: { density: "sm" } }),
      store.save({ name: "Beta", state: { density: "lg" } }),
    ]);
    expect(first.ok).to.equal(true);
    expect(second.ok).to.equal(true);
    expect((await store.list()).map((view) => view.name).sort()).to.deep.equal(["Alpha", "Beta"]);
  });

  it("round-trips through a localStorage adapter and drops unknown versions", async () => {
    const backend = new Map();
    const storage = createLocalStorageSavedViewStorage({
      getItem: (key) => backend.get(key) ?? null,
      setItem: (key, value) => backend.set(key, value),
    });
    storage.save("rowan-saved-views:orders", [
      {
        id: "view-1",
        name: "Packed",
        isDefault: true,
        updatedAt: 10,
        state: { version: 2, density: "lg", filters: [] },
      },
      {
        id: "view-2",
        name: "Future",
        state: { version: 9, density: "sm" },
      },
    ]);
    const loaded = storage.load("rowan-saved-views:orders");
    expect(loaded).to.have.length(1);
    expect(loaded[0].state.version).to.equal(2);
    expect(loaded[0].state.density).to.equal("lg");
  });
});

describe("rowan-saved-views", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("saves and applies filters, sort, columns, and density from the toolbar", async () => {
    const table = ordersTable();
    const builder = document.createElement("rowan-filter-builder");
    builder.slot = "toolbar";
    builder.fields = [
      { id: "status", label: "Status", type: "select", options: ["Packed", "Held", "Shipped"] },
    ];
    builder.filters = [{ id: "held", field: "status", operator: "equals", value: "Held" }];
    table.append(builder);

    const views = document.createElement("rowan-saved-views");
    views.share = "off";
    views.storage = createMemorySavedViewStorage();
    views.forTable = "orders";
    views.storageKey = "orders";
    views.label = "Order views";
    table.append(views);
    document.body.append(table);
    await settle();

    const changes = [];
    views.addEventListener("rowan-saved-views-change", (event) =>
      changes.push(event.detail.reason),
    );
    table.density = "sm";
    table.sort = { id: "order", dir: "asc" };

    const saved = await views.save("Held in the north");
    expect(saved.ok).to.equal(true);
    expect(changes).to.include("save");
    expect(views.views[0].state.version).to.equal(2);
    expect(views.views[0].state.filters[0].value).to.equal("Held");
    expect(views.views[0].state.density).to.equal("sm");
    expect(views.views[0].state.visibleColumns).to.deep.equal(["order", "status"]);

    table.density = "lg";
    builder.filters = [];
    let applied = null;
    views.addEventListener("rowan-saved-view-apply", (event) => {
      applied = event.detail;
    });
    expect(views.apply(saved.view.id)).to.equal(true);
    await settle();
    expect(applied.source).to.equal("user");
    expect(table.density).to.equal("sm");
    expect(builder.filters[0].value).to.equal("Held");
    expect(table.columns.find((column) => column.id === "owner").hidden).to.equal(true);
  });

  it("lets the host cancel apply and still rename from the keyboard", async () => {
    const table = ordersTable();
    const views = document.createElement("rowan-saved-views");
    views.share = "off";
    views.storage = createMemorySavedViewStorage([
      {
        id: "view-held",
        name: "Held orders",
        isDefault: false,
        updatedAt: 1,
        state: { density: "sm", filters: [{ field: "status", operator: "equals", value: "Held" }] },
      },
      {
        id: "view-packed",
        name: "Packed orders",
        isDefault: false,
        updatedAt: 2,
        state: { density: "lg", filters: [] },
      },
    ]);
    views.table = table;
    document.body.append(table, views);
    await settle();

    views.addEventListener("rowan-saved-view-apply", (event) => event.preventDefault());
    expect(views.apply("view-held")).to.equal(false);
    expect(table.density).to.equal("md");

    views.shadowRoot.querySelector("rowan-dropdown").open = true;
    await settle();
    const applyButtons = [...views.shadowRoot.querySelectorAll("[data-action='apply']")];
    applyButtons[0].focus();
    applyButtons[0].dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, composed: true }),
    );
    expect(views.shadowRoot.activeElement).to.equal(applyButtons[1]);

    views.shadowRoot.querySelector("[data-action='rename']").click();
    await settle();
    const input = views.shadowRoot.querySelector("[data-action='rename-input']");
    input.value = "Held and blocked";
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true, composed: true }),
    );
    await settle();
    expect(views.views[0].name).to.equal("Held and blocked");
  });

  it("confirms delete, sets a default, and shares the current view on the URL", async () => {
    const table = ordersTable();
    const views = document.createElement("rowan-saved-views");
    views.share = "on";
    views.shareParam = "view";
    views.storage = createMemorySavedViewStorage();
    views.table = table;
    const original = `${location.pathname}${location.search}`;
    document.body.append(table, views);
    await settle();

    const saved = await views.save("Shipped today");
    const shares = [];
    views.addEventListener("rowan-saved-view-share", (event) => shares.push(event.detail.url));
    const clipboard = [];
    const previousClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value) => {
          clipboard.push(value);
        },
      },
    });

    expect(await views.copyLink(saved.view.id)).to.equal(true);
    expect(location.search).to.include("view=");
    expect(clipboard[0]).to.include("view=");
    expect(shares[0]).to.equal(clipboard[0]);

    views.shadowRoot.querySelector("[data-action='default']").click();
    await settle();
    expect(views.views[0].isDefault).to.equal(true);

    views.shadowRoot.querySelector("[data-action='delete']").click();
    await settle();
    expect(views.shadowRoot.querySelector("[data-action='confirm-delete']")).to.exist;
    views.shadowRoot.querySelector("[data-action='confirm-delete']").click();
    await settle();
    expect(views.views).to.deep.equal([]);

    history.replaceState(null, "", original);
    if (previousClipboard) Object.defineProperty(navigator, "clipboard", previousClipboard);
    else delete navigator.clipboard;
  });

  it("applies a shared URL and leaves an invalid link alone", async () => {
    const table = ordersTable();
    table.density = "lg";
    const search = new URLSearchParams();
    search.set(
      "view",
      JSON.stringify({
        version: 2,
        density: "sm",
        filters: [{ field: "status", operator: "equals", value: "Packed" }],
      }),
    );
    const original = `${location.pathname}${location.search}`;
    history.replaceState(null, "", `${location.pathname}?${search.toString()}`);

    const views = document.createElement("rowan-saved-views");
    views.share = "on";
    views.storage = createMemorySavedViewStorage();
    views.table = table;
    document.body.append(table, views);
    await settle();
    expect(table.density).to.equal("sm");
    expect(table.filters[0].value).to.equal("Packed");

    history.replaceState(null, "", `${location.pathname}?view=%7Bnot-json`);
    window.dispatchEvent(new PopStateEvent("popstate"));
    await settle();
    expect(table.density).to.equal("sm");

    history.replaceState(null, "", original);
  });

  it("captures column order and restores it", () => {
    const table = ordersTable();
    table.columns = [
      { id: "owner", header: "Owner" },
      { id: "order", header: "Order" },
      { id: "status", header: "Status", hidden: true },
    ];
    const captured = captureTableViewState(table);
    expect(captured.columnOrder).to.deep.equal(["owner", "order", "status"]);
    table.columns = [
      { id: "status", header: "Status" },
      { id: "order", header: "Order" },
      { id: "owner", header: "Owner" },
    ];
    applyTableViewState(table, captured);
    expect(table.columns.map((column) => column.id)).to.deep.equal(["owner", "order", "status"]);
    expect(table.columns.find((column) => column.id === "status").hidden).to.equal(true);
  });

  it("restores a server page after the data module resets it", async () => {
    const table = ordersTable();
    table.dataMode = "server";
    const seen = [];
    table.dataSource = {
      debounce: 0,
      async getRows({ page }) {
        seen.push(page);
        return { rows: [], total: 80 };
      },
    };
    document.body.append(table);
    applyTableViewState(table, {
      page: { index: 2, size: 25 },
      filters: [{ field: "status", operator: "equals", value: "Held" }],
      sort: { id: "order", dir: "asc" },
    });
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(seen.at(-1)).to.equal(2);
    expect(table.page.index).to.equal(2);

    applyTableViewState(table, { page: { index: 0, size: 25 }, sort: { id: "order", dir: "asc" } });
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(seen.at(-1)).to.equal(0);
    expect(table.page.index).to.equal(0);
  });

  it("keeps a shared snapshot ahead of the default view", async () => {
    const table = ordersTable();
    const search = new URLSearchParams();
    search.set("view", JSON.stringify({ version: 2, density: "sm" }));
    const original = `${location.pathname}${location.search}`;
    history.replaceState(null, "", `${location.pathname}?${search.toString()}`);

    const views = document.createElement("rowan-saved-views");
    views.share = "on";
    views.storage = createMemorySavedViewStorage([
      {
        id: "view-default",
        name: "Spacious",
        isDefault: true,
        updatedAt: 1,
        state: { version: 2, density: "lg" },
      },
    ]);
    views.addEventListener("rowan-saved-view-apply", (event) => {
      if (event.detail.source === "url") event.preventDefault();
    });
    views.table = table;
    document.body.append(table, views);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await settle();
    expect(table.density).to.equal("md");

    history.replaceState(null, "", original);
  });

  it("applies a shared snapshot that arrives before the table", async () => {
    const search = new URLSearchParams();
    search.set("view", JSON.stringify({ version: 2, density: "sm" }));
    const original = `${location.pathname}${location.search}`;
    history.replaceState(null, "", `${location.pathname}?${search.toString()}`);

    const views = document.createElement("rowan-saved-views");
    views.share = "on";
    views.forTable = "orders";
    views.storage = createMemorySavedViewStorage([
      {
        id: "view-default",
        name: "Spacious",
        isDefault: true,
        updatedAt: 1,
        state: { version: 2, density: "lg" },
      },
    ]);
    document.body.append(views);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await settle();

    const table = ordersTable();
    document.body.append(table);
    views.table = table;
    await settle();
    expect(table.density).to.equal("sm");

    history.replaceState(null, "", original);
  });

  it("resubscribes after reconnect and keeps focus on confirm delete", async () => {
    const table = ordersTable();
    const views = document.createElement("rowan-saved-views");
    views.share = "off";
    views.storage = createMemorySavedViewStorage();
    views.messages = { deleteAction: "Remove", confirmDeleteAction: "Confirm remove" };
    views.table = table;
    document.body.append(table, views);
    await settle();
    await views.save("Held orders");
    await settle();

    views.remove();
    document.body.append(views);
    await settle();
    const reasons = [];
    views.addEventListener("rowan-saved-views-change", (event) =>
      reasons.push(event.detail.reason),
    );
    await views.rename(views.views[0].id, "Blocked orders");
    expect(views.views[0].name).to.equal("Blocked orders");
    expect(reasons).to.include("rename");
    expect(views.shadowRoot.querySelector("[data-action='delete']").textContent).to.equal("Remove");

    views.shadowRoot.querySelector("rowan-dropdown").open = true;
    await settle();
    views.shadowRoot.querySelector("[data-action='delete']").focus();
    views.shadowRoot.querySelector("[data-action='delete']").click();
    await settle();
    expect(views.shadowRoot.activeElement?.dataset.action).to.equal("confirm-delete");
    expect(views.shadowRoot.activeElement.textContent).to.equal("Confirm remove");
  });

  it("loads the table key after connecting and still applies a shared link when storage fails", async () => {
    const storage = createMemorySavedViewStorage();
    await createSavedViewStore({ key: "rowan-saved-views:orders", storage }).save({
      name: "Held orders",
      state: { density: "md" },
    });
    const early = document.createElement("rowan-saved-views");
    early.share = "off";
    early.storage = storage;
    document.body.append(early);
    await settle();
    expect(early.views.map((view) => view.name)).to.not.include("Held orders");
    const table = ordersTable();
    early.table = table;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await settle();
    expect(early.views.map((view) => view.name)).to.include("Held orders");

    const search = new URLSearchParams();
    search.set("view", JSON.stringify({ version: 2, density: "sm" }));
    const original = `${location.pathname}${location.search}`;
    history.replaceState(null, "", `${location.pathname}?${search.toString()}`);
    const blocked = document.createElement("rowan-saved-views");
    blocked.share = "on";
    blocked.storage = {
      load() {
        return Promise.reject(new Error("offline"));
      },
      save() {},
    };
    blocked.table = table;
    document.body.append(blocked);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await settle();
    expect(table.density).to.equal("sm");
    expect(blocked.shadowRoot.querySelector("[part='error']").hidden).to.equal(false);
    history.replaceState(null, "", original);
  });
});

void RowanSavedViews;
