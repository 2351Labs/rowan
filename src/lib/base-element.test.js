import { expect } from "@esm-bundle/chai";
import { BaseElement } from "./base-element.js";

const nextTask = () => new Promise((resolve) => setTimeout(resolve));
const TEST_TAG = "rowan-base-element-observer-test";

class BaseElementObserverTest extends BaseElement {
  #target = null;
  #observer = null;
  #mutationCount = 0;

  get mutationCount() {
    return this.#mutationCount;
  }

  mutate() {
    this.#target.append(document.createElement("span"));
  }

  render() {
    if (this.#target) return;

    this.#target = document.createElement("div");
    this.renderRoot.append(this.#target);

    this.#observer = new MutationObserver(() => {
      this.#mutationCount += 1;
    });

    const restore = () => {
      this.#observer.observe(this.#target, { childList: true });
    };

    restore();
    this.observe(this.#observer, restore);
  }
}

if (!customElements.get(TEST_TAG)) {
  customElements.define(TEST_TAG, BaseElementObserverTest);
}

describe("BaseElement", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("disconnects and restores configured observers across reconnection", async () => {
    const element = document.createElement(TEST_TAG);
    document.body.append(element);
    await nextTask();

    element.mutate();
    await nextTask();
    expect(element.mutationCount).to.equal(1);

    element.remove();
    element.mutate();
    await nextTask();
    expect(element.mutationCount).to.equal(1);

    document.body.append(element);
    await nextTask();
    element.mutate();
    await nextTask();

    expect(element.mutationCount).to.equal(2);
  });
});
