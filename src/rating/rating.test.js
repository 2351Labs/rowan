import { expect } from "@esm-bundle/chai";
import "./rating.js";

const nextMicrotask = () => Promise.resolve();

async function renderRating({ value = null, required = false } = {}) {
  const rating = document.createElement("rowan-rating");
  rating.label = "Quality";
  rating.required = required;
  rating.value = value;
  document.body.append(rating);
  await nextMicrotask();
  await nextMicrotask();
  return rating;
}

describe("rowan-rating", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reflects bounded integer values and preserves its no-rating state", async () => {
    const rating = await renderRating();
    rating.min = 2;
    rating.max = 8;
    rating.step = 2;
    rating.value = 5;
    await nextMicrotask();

    expect(rating.value).to.equal(6);
    expect(rating.getAttribute("value")).to.equal("6");
    expect(rating.shadowRoot.querySelectorAll("button[data-value]")).to.have.length(4);

    rating.value = null;
    await nextMicrotask();

    expect(rating.value).to.equal("");
    expect(rating.hasAttribute("value")).to.equal(false);
    expect(rating.shadowRoot.querySelector("output").textContent).to.equal("No rating selected");
  });

  it("normalizes the reflected value when its scale changes", async () => {
    const rating = await renderRating({ value: 5 });
    rating.min = 0;
    rating.max = 10;
    rating.step = 2;
    await nextMicrotask();

    expect(rating.value).to.equal(6);
    expect(rating.getAttribute("value")).to.equal("6");
  });

  it("keeps zero as the roving selected value for zero-based scales", async () => {
    const rating = document.createElement("rowan-rating");
    rating.min = 0;
    rating.max = 2;
    rating.value = 0;
    document.body.append(rating);
    await nextMicrotask();
    await nextMicrotask();

    const zero = rating.shadowRoot.querySelector("button[data-value='0']");
    expect(rating.value).to.equal(0);
    expect(zero.tabIndex).to.equal(0);
    expect(zero.getAttribute("aria-checked")).to.equal("true");
  });

  it("keeps parent-driven value changes silent and emits one composed change for user input", async () => {
    const rating = await renderRating({ value: 2 });
    const changes = [];
    rating.addEventListener("rowan-change", (event) => changes.push(event));

    rating.value = 3;
    await nextMicrotask();
    expect(changes).to.have.length(0);

    rating.shadowRoot.querySelector("button[data-value='4']").click();
    await nextMicrotask();

    expect(rating.value).to.equal(4);
    expect(changes).to.have.length(1);
    expect(changes[0].detail).to.deep.equal({ value: 4 });
    expect(changes[0].bubbles).to.equal(true);
    expect(changes[0].composed).to.equal(true);
  });

  it("uses Arrow, Home, and End keys to select and focus ratings", async () => {
    const rating = await renderRating({ value: 2 });
    const second = rating.shadowRoot.querySelector("button[data-value='2']");
    second.focus();
    second.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "ArrowRight" }),
    );
    await nextMicrotask();
    await nextMicrotask();

    const third = rating.shadowRoot.querySelector("button[data-value='3']");
    expect(rating.value).to.equal(3);
    expect(rating.shadowRoot.activeElement).to.equal(third);

    third.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "End" }),
    );
    await nextMicrotask();
    expect(rating.value).to.equal(5);

    const last = rating.shadowRoot.querySelector("button[data-value='5']");
    last.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "Home" }),
    );
    await nextMicrotask();
    expect(rating.value).to.equal(1);
  });

  it("submits through FACE, resets its default, and applies required validity", async () => {
    const form = document.createElement("form");
    const rating = document.createElement("rowan-rating");
    rating.name = "quality";
    rating.value = 3;
    form.append(rating);
    document.body.append(form);
    await nextMicrotask();
    await nextMicrotask();

    expect(new FormData(form).get("quality")).to.equal("3");

    rating.value = 5;
    form.reset();
    await nextMicrotask();
    expect(rating.value).to.equal(3);

    rating.required = true;
    rating.clear();
    await nextMicrotask();
    expect(rating.checkValidity()).to.equal(false);
  });

  it("provides a user clear command and preserves author ARIA", async () => {
    const rating = await renderRating({ value: 4 });
    const changes = [];
    rating.setAttribute("aria-label", "Review quality");
    rating.addEventListener("rowan-change", (event) => changes.push(event));
    await nextMicrotask();

    rating.shadowRoot.querySelector("button.clear").click();
    await nextMicrotask();

    expect(rating.value).to.equal("");
    expect(changes).to.have.length(1);
    expect(changes[0].detail).to.deep.equal({ value: "" });
    expect(rating.internals.role).to.equal("group");
    expect(rating.getAttribute("aria-label")).to.equal("Review quality");
    expect(rating.internals.ariaLabel).to.equal("Quality");
  });
});
