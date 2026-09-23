import { expect } from "@esm-bundle/chai";
import "./data-state.js";

const nextMicrotask = () => Promise.resolve();

async function renderState(state) {
  const el = document.createElement("rowan-data-state");
  const ready = document.createElement("p");
  ready.textContent = "Ready body";
  const loading = document.createElement("p");
  loading.slot = "loading";
  loading.textContent = "Custom loading";
  const empty = document.createElement("p");
  empty.slot = "empty";
  empty.textContent = "Custom empty";
  const error = document.createElement("p");
  error.slot = "error";
  error.textContent = "Custom error";
  const retry = document.createElement("button");
  retry.slot = "actions";
  retry.type = "button";
  retry.textContent = "Retry";
  el.append(ready, loading, empty, error, retry);
  if (state) el.state = state;
  document.body.append(el);
  await nextMicrotask();
  await nextMicrotask();
  return el;
}

describe("rowan-data-state", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("shows ready children and hides the other regions", async () => {
    const el = await renderState();
    expect(el.state).to.equal("ready");
    expect(el.hasAttribute("state")).to.equal(false);
    expect(el.shadowRoot.querySelector('[data-state="ready"]').hidden).to.equal(false);
    expect(el.shadowRoot.querySelector('[data-state="loading"]').hidden).to.equal(true);
    expect(el.shadowRoot.querySelector('[data-state="empty"]').hidden).to.equal(true);
    expect(el.shadowRoot.querySelector('[data-state="error"]').hidden).to.equal(true);
    expect(el.shadowRoot.querySelector(".actions").hidden).to.equal(true);
    expect(
      el.shadowRoot.querySelector('[data-state="ready"] slot').assignedElements()[0].textContent,
    ).to.equal("Ready body");
  });

  it("switches loading, empty, and error, and shows actions for empty and error", async () => {
    const el = await renderState("loading");
    expect(el.shadowRoot.querySelector('[data-state="loading"]').hidden).to.equal(false);
    expect(el.shadowRoot.querySelector('[data-state="ready"]').hidden).to.equal(true);
    expect(el.internals.ariaBusy).to.equal("true");
    expect(el.shadowRoot.querySelector('[data-state="loading"]').role).to.equal("status");

    el.state = "empty";
    await nextMicrotask();
    expect(el.shadowRoot.querySelector('[data-state="empty"]').hidden).to.equal(false);
    expect(el.shadowRoot.querySelector(".actions").hidden).to.equal(false);
    expect(el.internals.ariaBusy).to.equal("false");

    el.state = "error";
    await nextMicrotask();
    expect(el.shadowRoot.querySelector('[data-state="error"]').hidden).to.equal(false);
    expect(el.shadowRoot.querySelector('[data-state="error"]').role).to.equal("alert");
    expect(el.shadowRoot.querySelector(".actions").hidden).to.equal(false);
    expect(
      el.shadowRoot.querySelector('slot[name="actions"]').assignedElements()[0].textContent,
    ).to.equal("Retry");
  });

  it("uses fallback copy when loading, empty, and error slots are vacant", async () => {
    const el = document.createElement("rowan-data-state");
    el.state = "loading";
    document.body.append(el);
    await nextMicrotask();
    expect(el.shadowRoot.querySelector('[data-state="loading"] .fallback').textContent).to.equal(
      "Loading",
    );

    el.state = "empty";
    await nextMicrotask();
    expect(el.shadowRoot.querySelector('[data-state="empty"] .fallback').textContent).to.equal(
      "No data",
    );

    el.state = "error";
    await nextMicrotask();
    expect(el.shadowRoot.querySelector('[data-state="error"] .fallback').textContent).to.equal(
      "Couldn't load this data",
    );
  });
});
