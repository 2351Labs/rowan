import { expect } from "@esm-bundle/chai";

import { normalizeMessages, resolveMessage } from "./messages.js";

const DEFAULTS = Object.freeze({
  label: "Default label",
  status: "Page {page} of {total}",
  dynamic: ({ count }) => `${count} selected`,
});

describe("component messages", () => {
  it("keeps only supported property-only overrides", () => {
    const source = {
      label: "Translated label",
      status: "{page} de {total}",
      unknown: "Ignored",
    };

    const messages = normalizeMessages(source, DEFAULTS);

    expect(messages).to.deep.equal({
      label: "Translated label",
      status: "{page} de {total}",
    });
    expect(messages).to.not.equal(source);
    expect(source).to.deep.equal({
      label: "Translated label",
      status: "{page} de {total}",
      unknown: "Ignored",
    });
  });

  it("interpolates strings and accepts dynamic override functions", () => {
    const messages = normalizeMessages(
      {
        status: "{page} de {total}",
        dynamic: ({ count }) => `${count} elementos seleccionados`,
      },
      DEFAULTS,
    );

    expect(resolveMessage(messages, DEFAULTS, "status", { page: 2, total: 5 })).to.equal("2 de 5");
    expect(resolveMessage(messages, DEFAULTS, "dynamic", { count: 3 })).to.equal(
      "3 elementos seleccionados",
    );
  });

  it("uses defaults for malformed, empty, and throwing overrides", () => {
    const messages = normalizeMessages(
      {
        label: "   ",
        status: () => {
          throw new Error("translation unavailable");
        },
      },
      DEFAULTS,
    );

    expect(resolveMessage(messages, DEFAULTS, "label")).to.equal("Default label");
    expect(resolveMessage(messages, DEFAULTS, "status", { page: 2, total: 5 })).to.equal(
      "Page 2 of 5",
    );
    expect(resolveMessage(messages, DEFAULTS, "dynamic", { count: 1 })).to.equal("1 selected");
  });
});
