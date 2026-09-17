import { expect } from "@esm-bundle/chai";
import { createElement, useEffect, useRef } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";

import "../../src/button/button.js";

const wait = () => Promise.resolve();
const nextTask = () => new Promise((resolve) => setTimeout(resolve));

function HydratedButton({ disabled }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.disabled = disabled;
  }, [disabled]);

  return createElement("rowan-button", { disabled, ref }, "Save");
}

describe("React 18 SSR compatibility", () => {
  let root = null;

  afterEach(async () => {
    if (root) {
      root.unmount();
      root = null;
    }

    document.body.innerHTML = "";
  });

  it("drops a false JSX boolean attribute after custom-element upgrade", async () => {
    const markup = renderToStaticMarkup(createElement("rowan-button", { disabled: false }, "Save"));
    const container = document.createElement("div");
    container.innerHTML = markup;
    document.body.append(container);
    await wait();

    const button = container.querySelector("rowan-button");
    expect(markup).to.include('disabled="false"');
    expect(button.hasAttribute("disabled")).to.equal(false);
    expect(button.disabled).to.equal(false);
  });

  it("hydrates a false boolean through a client-side property assignment", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(
      createElement("rowan-button", { disabled: false }, "Save"),
    );
    document.body.append(container);

    root = hydrateRoot(container, createElement(HydratedButton, { disabled: false }));
    await nextTask();
    await nextTask();

    const button = container.querySelector("rowan-button");
    expect(button.hasAttribute("disabled")).to.equal(false);
    expect(button.disabled).to.equal(false);
  });

  it("keeps a false server-rendered boolean absent when it is conditionally omitted", async () => {
    const disabled = false;
    const props = disabled ? { disabled: true } : {};
    const markup = renderToStaticMarkup(createElement("rowan-button", props, "Save"));
    const container = document.createElement("div");
    container.innerHTML = markup;
    document.body.append(container);
    await wait();

    const button = container.querySelector("rowan-button");
    expect(markup).to.not.include("disabled");
    expect(button.disabled).to.equal(false);
  });
});
